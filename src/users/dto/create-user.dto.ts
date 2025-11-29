// src/users/dto/create-user.dto.ts
import {
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsString,
  MaxLength,
} from "class-validator";
import type { UserRole } from "../entities/user.entity";

export class CreateUserDto {
  @IsNumber()
  clientId: number;

  @IsEmail()
  @MaxLength(150)
  email: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  password: string;

  @IsString()
  @IsIn(["OWNER", "ADMIN", "VIEWER"])
  role: UserRole;
}
