// src/auth/dto/login.dto.ts
import { IsEmail, IsNotEmpty, MaxLength } from "class-validator";

export class LoginDto {
  @IsEmail()
  @MaxLength(150)
  email: string;

  @IsNotEmpty()
  @MaxLength(100)
  password: string;
}
