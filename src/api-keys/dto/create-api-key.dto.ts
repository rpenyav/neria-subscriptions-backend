// src/api-keys/dto/create-api-key.dto.ts
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
} from "class-validator";

export class CreateApiKeyDto {
  @IsNumber()
  clientId: number;

  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  name: string;

  // No permitimos pasar publicKey/secret desde fuera: se generan dentro del servicio
}
