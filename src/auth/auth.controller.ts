import { Body, Controller, Post, Req, Res } from '@nestjs/common';
import type { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshDto } from './dto/refresh.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  async login(@Body() dto: LoginDto, @Res({ passthrough: true }) res: Response) {


    const {accessToken, user, refreshCookie} = await this.authService.login(dto);

    res.cookie(refreshCookie.name, refreshCookie.value, refreshCookie.options);

    return { 
        accessToken,
        user 
    };
  }

  @Post('refresh')
  async refresh(
    @Req() req: Request,
    @Body() dto: RefreshDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const cookieName = this.authService.getRefreshCookieName();
    const cookieRt = (req as any).cookies?.[cookieName];
    const rt = cookieRt ?? dto.refreshToken;

    const result = await this.authService.refresh(rt);

    res.cookie(result.refreshCookie.name, result.refreshCookie.value, result.refreshCookie.options);

    return { 
        accessToken: result.accessToken
    };
  }

  @Post('logout')
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const cookieName = this.authService.getRefreshCookieName();
    const rt = (req as any).cookies?.[cookieName];

    await this.authService.logout(rt);

    res.clearCookie(cookieName, { path: '/auth/refresh' });
    return { message: 'Logged out' };
  }
}
