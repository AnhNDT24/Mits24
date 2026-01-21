import { Injectable, UnauthorizedException } from "@nestjs/common";
import type { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import type { UserEntity } from "src/users/entities/user.entity";
import type { UsersService } from "../users/user.service";
import type { JwtPayload } from "./types";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor(
		private readonly configService: ConfigService,
		private readonly usersService: UsersService,
	) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: false,
			secretOrKey: configService.getOrThrow("JWT_ACCESS_SECRET"),
		});
	}

	async validate(payload: JwtPayload): Promise<UserEntity> {
		const userId = parseInt(payload.sub, 10);
		if (isNaN(userId)) {
			throw new UnauthorizedException();
		}

		const user = await this.usersService.findOne(userId);
		if (!user) {
			throw new UnauthorizedException();
		}
		return user;
	}
}
