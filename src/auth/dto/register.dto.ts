import { IsEmail, IsMobilePhone, IsOptional, IsString,MinLength } from "class-validator";

export class RegisterDto {
    @IsOptional()
    @IsEmail()
    email?: string;

    @IsOptional()
    @IsMobilePhone()
    phone?: string;

    @IsString()
    @MinLength(6)
    password: string;

    @IsString()
    name: string;
}