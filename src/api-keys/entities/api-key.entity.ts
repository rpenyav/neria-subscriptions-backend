// src/api-keys/entities/api-key.entity.ts
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

export type ApiKeyStatus = "active" | "revoked";

@Entity({ name: "api_keys" })
export class ApiKey {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  clientId: number;

  @ManyToOne(() => Client, (client) => client.apiKeys, { nullable: false })
  @JoinColumn({ name: "clientId" })
  client: Client;

  @Column({ length: 150 })
  name: string;

  @Column({ name: "public_key", length: 255, unique: true })
  publicKey: string;

  @Column({ name: "secret_hash", length: 255 })
  secretHash: string;

  @Column({ type: "varchar", length: 20, default: "active" })
  status: ApiKeyStatus;

  @Column({ name: "revoked_at", type: "datetime", nullable: true })
  revokedAt: Date | null;

  @Column({ name: "last_used_at", type: "datetime", nullable: true })
  lastUsedAt: Date | null;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;
}
