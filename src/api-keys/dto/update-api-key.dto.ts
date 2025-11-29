// src/api-keys/dto/update-api-key.dto.ts
import { IsIn, IsOptional, IsString, MaxLength } from "class-validator";
import type { ApiKeyStatus } from "../entities/api-key.entity";

export class UpdateApiKeyDto {
  @IsString()
  @IsOptional()
  @MaxLength(150)
  name?: string;

  @IsString()
  @IsOptional()
  @IsIn(["active", "revoked"])
  status?: ApiKeyStatus;
}
