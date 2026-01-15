import {
    BadRequestException,
    ConflictException,
    Injectable,
    UnauthorizedException,
  } from '@nestjs/common';
  import { JwtService } from '@nestjs/jwt';
  import { ConfigService } from '@nestjs/config';
  import * as bcrypt from 'bcrypt';
  import { UsersService } from '../users/user.service';
  import { RegisterDto } from './dto/register.dto';
  import { LoginDto } from './dto/login.dto';
  import { CreateUserInput } from './dto/create-user-input.dto'
  
  @Injectable()
  export class AuthService {
    constructor(
      private readonly usersService: UsersService,
      private readonly jwtService: JwtService,
      private readonly config: ConfigService,
    ) {}
  
    getRefreshCookieName() {
      return this.config.get('COOKIE_REFRESH_NAME') ?? 'rt';
    }
  
    private getRefreshCookieOptions() {
      const secure = this.config.get('COOKIE_SECURE') === 'true';
  
      return {
        httpOnly: true,
        secure,
        sameSite: secure ? 'none' : 'lax',
        path: '/auth/refresh',
        domain: this.config.get('COOKIE_DOMAIN') ?? undefined,
        maxAge: 30 * 24 * 60 * 60 * 1000,
      } as const;
    }
  
    private async signAccessToken(userId: number) {
      return this.jwtService.signAsync(
        { sub: userId },
        {
          secret: this.config.getOrThrow('JWT_ACCESS_SECRET'),
          expiresIn: this.config.get('JWT_ACCESS_EXPIRES_IN') ?? '15m',
        },
      );
    }
  
    private async signRefreshToken(userId: number) {
      return this.jwtService.signAsync(
        { sub: userId },
        {
          secret: this.config.getOrThrow('JWT_REFRESH_SECRET'),
          expiresIn: this.config.get('JWT_REFRESH_EXPIRES_IN') ?? '30d',
        },
      );
    }
  
    async register(dto: RegisterDto) {
      if (!dto.email && !dto.phone) {
        throw new BadRequestException('Email or phone is required');
      }
  
      if (dto.email) {
        const existEmail = await this.usersService.findByEmail(dto.email);
        if (existEmail) throw new ConflictException('Email has already been used');
      }
  
      if (dto.phone) {
        const existPhone = await this.usersService.findByPhone(dto.phone);
        if (existPhone) throw new ConflictException('Phone number has already been used');
      }
  
      const passwordHash = await bcrypt.hash(dto.password, 10);

      const input: CreateUserInput = {
        email: dto.email ?? null,
        phone: dto.phone ?? null,
        name: dto.name,
        passwordHash,
      };
    
      const user = await this.usersService.create(input);
    
      return { message: 'Registration successful', userId: user.id };
    }
  
    async login(dto: LoginDto) {
      const user = await this.usersService.findByEmailOrPhone(dto.identifier);
      if (!user) throw new UnauthorizedException('Invalid login credentials');
  
      const valid = await bcrypt.compare(dto.password, user.passwordHash);
      if (!valid) throw new UnauthorizedException('Invalid login credentials');
  
      const accessToken = await this.signAccessToken(user.id);
      const refreshToken = await this.signRefreshToken(user.id);
  
      const refreshTokenHash = await bcrypt.hash(refreshToken, 10);
      await this.usersService.setRefreshTokenHash(user.id, refreshTokenHash);
  
      return {
        user: {
            id: user.id,
            email: user.email,
            phone: user.phone,
            name: user.name,
            fullName: user.fullName,
            avatar: user.avatar,
            status: user.status,
        } ,
        accessToken,
        refreshCookie: {
          name: this.getRefreshCookieName(),
          value: refreshToken,
          options: this.getRefreshCookieOptions(),
        },
      };
    }
  
    async refresh(refreshToken?: string) {
      if (!refreshToken) throw new UnauthorizedException();
  
      let payload: any;
      try {
        payload = await this.jwtService.verifyAsync(refreshToken, {
          secret: this.config.getOrThrow('JWT_REFRESH_SECRET'),
        });
      } catch {
        throw new UnauthorizedException();
      }
  
      const userId = Number(payload.sub);
      const user = await this.usersService.findOneWithRefreshTokenHash(userId);
      if (!user || !user.refreshTokenHash) throw new UnauthorizedException();
  
      const ok = await bcrypt.compare(refreshToken, user.refreshTokenHash);
  
      // reuse detection
      if (!ok) {
        await this.usersService.revokeRefreshToken(userId);
        throw new UnauthorizedException('Refresh token reuse detected');
      }
  
      // rotation
      const accessToken = await this.signAccessToken(userId);
      const newRefreshToken = await this.signRefreshToken(userId);
  
      const newHash = await bcrypt.hash(newRefreshToken, 10);
      await this.usersService.setRefreshTokenHash(userId, newHash);
  
      return {
        accessToken,
        refreshCookie: {
          name: this.getRefreshCookieName(),
          value: newRefreshToken,
          options: this.getRefreshCookieOptions(),
        },
      };
    }
  
    async logout(refreshToken?: string) {
      if (!refreshToken) return;
  
      try {
        const payload = await this.jwtService.verifyAsync(refreshToken, {
          secret: this.config.getOrThrow('JWT_REFRESH_SECRET'),
        });
  
        await this.usersService.revokeRefreshToken(Number(payload.sub));
      } catch {
        // ignore
      }
    }
  }
  