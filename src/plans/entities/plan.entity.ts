// src/plans/entities/plan.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { Subscription } from "../../subscriptions/entities/subscription.entity";

@Entity({ name: "plans" })
export class Plan {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  name: string;

  // 👇 IMPORTANTE: string, no Object
  @Column({ type: "varchar", length: 255, nullable: true })
  description?: string | null;

  // Precio mensual (decimal → TypeORM lo devuelve como string)
  @Column({ name: "price_month", type: "decimal", precision: 10, scale: 2 })
  priceMonth: string;

  @Column({ length: 3, default: "EUR" })
  currency: string;

  // Aquí sí usamos JSON porque en la entity está como Record<string, any>
  @Column({ type: "json", nullable: true })
  features: Record<string, any> | null;

  @Column({ type: "boolean", default: true })
  isActive: boolean;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;

  @OneToMany(() => Subscription, (subscription) => subscription.plan)
  subscriptions: Subscription[];
}
