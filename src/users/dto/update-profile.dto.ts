import { IsOptional, IsString, IsUrl, MaxLength, Matches } from "class-validator";

export class UpdateDateColumn {
    @IsOptional()
    @IsString()
    @MaxLength(120)
    name?: string;
  
    @IsOptional()
    @IsString()
    @MaxLength(120)
    fullName?: string;
  
    @IsOptional()
    @IsUrl()
    avatar?: string;
  
    @IsOptional()
    @Matches(/^(?:\+84|0)(3|5|7|8|9)\d{8}$/)
    phone?: string;
}