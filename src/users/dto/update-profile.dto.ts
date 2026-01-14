import { IsMobilePhone, IsOptional, IsString, IsUrl, MaxLength } from "class-validator";

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
    @IsMobilePhone(['VN'] as any)
    phone?: string;
}