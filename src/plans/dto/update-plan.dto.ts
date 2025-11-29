// src/plans/dto/update-plan.dto.ts
import {
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  IsObject,
  MaxLength,
  Min,
} from "class-validator";

export class UpdatePlanDto {
  @IsString()
  @IsOptional()
  @MaxLength(100)
  name?: string;

  @IsString()
  @IsOptional()
  @MaxLength(255)
  description?: string;

  @IsNumber()
  @IsOptional()
  @Min(0)
  priceMonth?: number;

  @IsString()
  @IsOptional()
  @MaxLength(3)
  currency?: string;

  @IsObject()
  @IsOptional()
  features?: Record<string, any>;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
