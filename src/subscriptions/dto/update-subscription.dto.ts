// src/subscriptions/dto/update-subscription.dto.ts
import {
  IsBoolean,
  IsDateString,
  IsIn,
  IsNumber,
  IsOptional,
} from "class-validator";
import type { SubscriptionStatus } from "../entities/subscription.entity";

export class UpdateSubscriptionDto {
  @IsNumber()
  @IsOptional()
  clientId?: number;

  @IsNumber()
  @IsOptional()
  planId?: number;

  @IsIn(["trialing", "active", "past_due", "canceled"])
  @IsOptional()
  status?: SubscriptionStatus;

  @IsDateString()
  @IsOptional()
  startAt?: string;

  @IsDateString()
  @IsOptional()
  currentPeriodStart?: string;

  @IsDateString()
  @IsOptional()
  currentPeriodEnd?: string;

  @IsBoolean()
  @IsOptional()
  cancelAtPeriodEnd?: boolean;

  @IsDateString()
  @IsOptional()
  canceledAt?: string;
}
