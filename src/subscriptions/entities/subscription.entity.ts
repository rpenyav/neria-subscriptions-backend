// src/subscriptions/entities/subscription.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { Client } from "../../clients/entities/client.entity";
import { Plan } from "../../plans/entities/plan.entity";

export type SubscriptionStatus =
  | "trialing"
  | "active"
  | "past_due"
  | "canceled";

@Entity({ name: "subscriptions" })
export class Subscription {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  clientId: number;

  @ManyToOne(() => Client, (client) => client.subscriptions, {
    nullable: false,
  })
  @JoinColumn({ name: "clientId" })
  client: Client;

  @Column()
  planId: number;

  @ManyToOne(() => Plan, (plan) => plan.subscriptions, { nullable: false })
  @JoinColumn({ name: "planId" })
  plan: Plan;

  @Column({ type: "varchar", length: 20, default: "active" })
  status: SubscriptionStatus;

  @Column({ name: "start_at", type: "datetime" })
  startAt: Date;

  @Column({ name: "current_period_start", type: "datetime" })
  currentPeriodStart: Date;

  @Column({ name: "current_period_end", type: "datetime" })
  currentPeriodEnd: Date;

  @Column({ name: "cancel_at_period_end", type: "boolean", default: false })
  cancelAtPeriodEnd: boolean;

  @Column({ name: "canceled_at", type: "datetime", nullable: true })
  canceledAt: Date | null;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;
}
