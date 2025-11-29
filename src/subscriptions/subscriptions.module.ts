// src/subscriptions/subscriptions.module.ts
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SubscriptionsController } from "./subscriptions.controller";
import { SubscriptionsService } from "./subscriptions.service";
import { Subscription } from "./entities/subscription.entity";
import { Client } from "../clients/entities/client.entity";
import { Plan } from "../plans/entities/plan.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Subscription, Client, Plan])],
  controllers: [SubscriptionsController],
  providers: [SubscriptionsService],
  exports: [SubscriptionsService],
})
export class SubscriptionsModule {}
