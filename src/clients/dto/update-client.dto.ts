// src/clients/dto/update-client.dto.ts
import { IsIn, IsOptional, IsString, MaxLength } from "class-validator";
import type { ClientStatus } from "../entities/client.entity";

export class UpdateClientDto {
  @IsString()
  @IsOptional()
  @MaxLength(150)
  name?: string;

  @IsString()
  @IsOptional()
  @MaxLength(150)
  slug?: string;

  @IsString()
  @IsOptional()
  @IsIn(["active", "paused", "banned"])
  status?: ClientStatus;
}
