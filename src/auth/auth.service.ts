import {
    BadRequestException,
    ConflictException,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcrypt'

import { UsersService } from '../users/user.service'
import { RegisterDto } from './dto/register.dto'
import { LoginDto } from './dto/login.dto'

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
    ) {}

    async register(dto: RegisterDto) {
        if (!dto.email && !dto.phone) {
            throw new BadRequestException('Email or phone is required')
        }

        if (dto.email) {
            const existEmail = await this.usersService.findByEmail(dto.email);
            if (existEmail) {
                throw new ConflictException('Email has already been used')
            }
        }

        if (dto.phone) {
            const existPhone = await this.usersService.findByPhone(dto.phone);
            if (existPhone) {
                throw new ConflictException('Phone number has already been used')
            }
        }

        const passwordHash = await bcrypt.hash(dto.password, 10);

        const user = await this.usersService.create({ 
            email: dto.email ?? '',
            phone: dto.phone ?? '',
            name: dto.name,
            passwordHash: passwordHash,
        });

        return { message: 'Registration successful', userId: user.id };
    }

    async login(dto: LoginDto) {
        const user = await this.usersService.findByEmailOrPhone(dto.identifier);
        if (!user) {
            throw new UnauthorizedException('Invalid login credentials')
        }

        const valid = await bcrypt.compare(dto.password, user.passwordHash);
        if(!valid) {
            throw new UnauthorizedException('Invalid login credentials');
        }

        const payload = { sub: user.id, email: user.email, phone: user.phone };
        const access_token = await this.jwtService.signAsync(payload);

        return { access_token };
    }
}