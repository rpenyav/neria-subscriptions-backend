// src/clients/entities/client.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { User } from "../../users/entities/user.entity";
import { Subscription } from "../../subscriptions/entities/subscription.entity";
import { ApiKey } from "../../api-keys/entities/api-key.entity";

export type ClientStatus = "active" | "paused" | "banned";

@Entity({ name: "clients" })
export class Client {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 150 })
  name: string;

  @Column({ length: 150, unique: true })
  slug: string;

  @Column({ type: "varchar", length: 20, default: "active" })
  status: ClientStatus;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;

  @OneToMany(() => User, (user) => user.client)
  users: User[];

  @OneToMany(() => Subscription, (subscription) => subscription.client)
  subscriptions: Subscription[];

  @OneToMany(() => ApiKey, (apiKey) => apiKey.client)
  apiKeys: ApiKey[];
}
