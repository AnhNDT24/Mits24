import { Body, Controller, Get, Patch, Post, UseGuards } from "@nestjs/common";
import { CurrentUser } from "src/common/decorators/current-user.decorator";
import { JwtAuthGuard } from "../common/guards/jwt-auth.guard";
import type { CreateUserDto } from "./dto/create-user.dto";
import type { UpdateDateColumn } from "./dto/update-profile.dto";
import type { UserEntity } from "./entities/user.entity";
import type { UsersService } from "./user.service";

@Controller("users")
export class UsersController {
	constructor(private usersService: UsersService) {}

	@Get("me")
	@UseGuards(JwtAuthGuard)
	getMe(@CurrentUser() user: UserEntity) {
		return user;
	}

	@Post()
	async create(@Body() dto: CreateUserDto) {
		return this.usersService.createFromDto(dto);
	}

	@Patch("profile")
	@UseGuards(JwtAuthGuard)
	updateProfile(
		@CurrentUser() user: UserEntity,
		@Body() dto: UpdateDateColumn,
	) {
		return this.usersService.update(user.id, dto);
	}
}
