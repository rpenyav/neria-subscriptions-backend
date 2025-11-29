// src/api-keys/api-keys.module.ts
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ApiKeysController } from "./api-keys.controller";
import { ApiKeysService } from "./api-keys.service";
import { ApiKey } from "./entities/api-key.entity";
import { Client } from "../clients/entities/client.entity";

@Module({
  imports: [TypeOrmModule.forFeature([ApiKey, Client])],
  controllers: [ApiKeysController],
  providers: [ApiKeysService],
  exports: [ApiKeysService],
})
export class ApiKeysModule {}
