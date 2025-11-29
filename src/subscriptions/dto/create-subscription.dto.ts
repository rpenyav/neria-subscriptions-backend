// src/subscriptions/dto/create-subscription.dto.ts
import {
  IsBoolean,
  IsDateString,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
} from "class-validator";
import type { SubscriptionStatus } from "../entities/subscription.entity";

export class CreateSubscriptionDto {
  @IsNumber()
  clientId: number;

  @IsNumber()
  planId: number;

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
}
