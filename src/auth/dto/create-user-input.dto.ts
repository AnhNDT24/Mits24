import { UserStatus } from "src/users/entities/user.entity";

export interface CreateUserInput {
	email?: string | null;
	phone?: string | null;
	name: string;
	fullName?: string;
	avatar?: string;
	status?: UserStatus;
	passwordHash: string;
}
