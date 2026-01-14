import { IsEmail, IsEnum, IsOptional, IsString, IsUrl, MinLength, IsPhoneNumber } from "class-validator";
import { UserStatus } from "../entities/user.entity";

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  name: string;

  @IsPhoneNumber(['vi-VN, jp-JP'] as any)
  phone: string;

  @IsOptional()
  @IsString()
  fullName?: string;

  @IsOptional()
  @IsUrl()
  avatar?: string;

  @IsOptional()
  @IsEnum(UserStatus)
  status?: UserStatus;
}
