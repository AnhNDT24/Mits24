import {
  IsEmail,
  Matches,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class RegisterDto {
  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @Matches(/^(?:\+84|0)(3|5|7|8|9)\d{8}$/)
  phone?: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  name: string;
}
