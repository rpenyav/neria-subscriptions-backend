// src/users/dto/update-user.dto.ts
import {
  IsEmail,
  IsIn,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
} from "class-validator";
import type { UserRole } from "../entities/user.entity";

export class UpdateUserDto {
  @IsNumber()
  @IsOptional()
  clientId?: number;

  @IsEmail()
  @IsOptional()
  @MaxLength(150)
  email?: string;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  password?: string;

  @IsString()
  @IsOptional()
  @IsIn(["OWNER", "ADMIN", "VIEWER"])
  role?: UserRole;
}
