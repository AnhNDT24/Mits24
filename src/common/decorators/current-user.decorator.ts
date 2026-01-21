import { createParamDecorator, type ExecutionContext } from "@nestjs/common";
import type { Request } from "express";
import type { UserEntity } from "../../users/entities/user.entity";

export const CurrentUser = createParamDecorator(
	(data: unknown, ctx: ExecutionContext): UserEntity | undefined => {
		const request = ctx.switchToHttp().getRequest<Request>();
		return request.user;
	},
);
