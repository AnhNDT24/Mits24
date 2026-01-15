import { Controller, Get, Post, Body, Patch,UseGuards, Req } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/jwt-auth.guard"
import { CreateUserDto } from "./dto/create-user.dto";
import { UsersService } from "./user.service";
import { UpdateDateColumn } from "./dto/update-profile.dto"
@Controller("users")
export class UsersController {
	constructor(private usersService: UsersService) {}

	@Get('me')
	@UseGuards(JwtAuthGuard)
	getMe(@Req() req) {
		return req.user;
	}

	@Post()
	create(@Body() dto: CreateUserDto) {
		// Assume the password is provided as 'password' in dto, and needs to be hashed to 'passwordHash'
		const { password, ...rest } = dto as any;
		const passwordHash = (password);

		return this.usersService.create({
			...rest,
			passwordHash,
		});
	}
	@Patch('profile')
	@UseGuards(JwtAuthGuard)
	updateProfile(@Req() req, @Body() dto: UpdateDateColumn) {
	return this.usersService.update(req.user.id, dto);
	}

}
