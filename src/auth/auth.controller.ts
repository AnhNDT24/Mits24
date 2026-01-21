import {
	BadRequestException,
	Body,
	Controller,
	Post,
	Req,
	Res,
} from "@nestjs/common";
import type { Request, Response } from "express";
import {
	clearRefreshCookie,
	getRefreshTokenFromRequest,
	setRefreshCookie,
} from "./auth.helpers";
import type { AuthService } from "./auth.service";
import type { LoginDto } from "./dto/login.dto";
import type { RefreshDto } from "./dto/refresh.dto";
import type { RegisterDto } from "./dto/register.dto";
import type { LoginResult, RefreshResult } from "./types";

@Controller("auth")
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Post("register")
	register(@Body() dto: RegisterDto) {
		return this.authService.register(dto);
	}

	@Post("login")
	async login(
		@Body() dto: LoginDto,
		@Res({ passthrough: true }) res: Response,
	): Promise<LoginResult> {
		const result = await this.authService.login(dto);

		setRefreshCookie(res, result.refreshCookie);

		return result;
	}

	@Post("refresh")
	async refresh(
		@Req() req: Request,
		@Body() dto: RefreshDto,
		@Res({ passthrough: true }) res: Response,
	): Promise<{ accessToken: string }> {
		const cookieName = this.authService.getRefreshCookieName();

		const rt = getRefreshTokenFromRequest(req, cookieName) ?? dto.refreshToken;

		if (!rt) {
			throw new BadRequestException("Missing refresh token");
		}

		const result: RefreshResult = await this.authService.refresh(rt);

		setRefreshCookie(res, result.refreshCookie);

		return { accessToken: result.accessToken };
	}

	@Post("logout")
	async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
		const cookieName = this.authService.getRefreshCookieName();

		const rt = getRefreshTokenFromRequest(req, cookieName);

		if (rt) {
			await this.authService.logout(rt);
		}

		clearRefreshCookie(res, cookieName);

		return { message: "Logged out" };
	}
}
