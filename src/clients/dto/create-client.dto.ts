// src/clients/dto/create-client.dto.ts
import {
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from "class-validator";
import type { ClientStatus } from "../entities/client.entity";

export class CreateClientDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  name: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  slug: string;

  @IsString()
  @IsOptional()
  @IsIn(["active", "paused", "banned"])
  status?: ClientStatus;
}
