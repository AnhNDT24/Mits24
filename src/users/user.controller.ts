import { Controller, Get, Post, Body } from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { UsersService } from "./user.service";

@Controller("users")
export class UsersController {
	constructor(private usersService: UsersService) {}

	@Get()
	findAll() {
		return this.usersService.findAll();
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
}
