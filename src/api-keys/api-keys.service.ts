// src/api-keys/api-keys.service.ts
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import * as bcrypt from "bcrypt";
import { randomBytes } from "crypto";
import { ApiKey } from "./entities/api-key.entity";
import { Client } from "../clients/entities/client.entity";
import { CreateApiKeyDto } from "./dto/create-api-key.dto";
import { UpdateApiKeyDto } from "./dto/update-api-key.dto";

@Injectable()
export class ApiKeysService {
  constructor(
    @InjectRepository(ApiKey)
    private readonly apiKeysRepository: Repository<ApiKey>,
    @InjectRepository(Client)
    private readonly clientsRepository: Repository<Client>
  ) {}

  private generateKeyPair(): { publicKey: string; secret: string } {
    const random = randomBytes(32).toString("hex"); // 64 chars
    const publicKey = `NERIA_LIVE_${random.slice(0, 16)}`;
    const secret = random; // podrías separar en partes, pero así ya es suficientemente robusto
    return { publicKey, secret };
  }

  async create(createApiKeyDto: CreateApiKeyDto): Promise<{
    apiKey: ApiKey;
    secret: string;
  }> {
    const { clientId, name } = createApiKeyDto;

    const client = await this.clientsRepository.findOne({
      where: { id: clientId },
    });
    if (!client) {
      throw new NotFoundException(`Client with id ${clientId} not found`);
    }

    const { publicKey, secret } = this.generateKeyPair();
    const secretHash = await bcrypt.hash(secret, 10);

    const existing = await this.apiKeysRepository.findOne({
      where: { publicKey },
    });
    if (existing) {
      throw new ConflictException(
        "Generated API key already exists, try again"
      );
    }

    const apiKey = this.apiKeysRepository.create({
      clientId,
      client,
      name,
      publicKey,
      secretHash,
      status: "active",
      revokedAt: null,
      lastUsedAt: null,
    });

    const saved = await this.apiKeysRepository.save(apiKey);

    // Muy importante: solo devolvemos secret aquí una vez
    return {
      apiKey: saved,
      secret,
    };
  }

  async findAll(): Promise<ApiKey[]> {
    return this.apiKeysRepository.find({
      relations: ["client"],
    });
  }

  async findOne(id: number): Promise<ApiKey> {
    const key = await this.apiKeysRepository.findOne({
      where: { id },
      relations: ["client"],
    });

    if (!key) {
      throw new NotFoundException(`ApiKey with id ${id} not found`);
    }

    return key;
  }

  async update(id: number, updateApiKeyDto: UpdateApiKeyDto): Promise<ApiKey> {
    const key = await this.findOne(id);

    if (updateApiKeyDto.name) {
      key.name = updateApiKeyDto.name;
    }

    if (updateApiKeyDto.status) {
      key.status = updateApiKeyDto.status;
      if (updateApiKeyDto.status === "revoked" && !key.revokedAt) {
        key.revokedAt = new Date();
      }
    }

    return this.apiKeysRepository.save(key);
  }

  async revoke(id: number): Promise<ApiKey> {
    const key = await this.findOne(id);
    key.status = "revoked";
    key.revokedAt = new Date();
    return this.apiKeysRepository.save(key);
  }

  // Este método será útil más adelante para el backend del chatbot
  async validatePublicAndSecret(
    publicKey: string,
    secret: string
  ): Promise<ApiKey | null> {
    const apiKey = await this.apiKeysRepository.findOne({
      where: { publicKey, status: "active" },
      relations: ["client"],
    });

    if (!apiKey) return null;

    const match = await bcrypt.compare(secret, apiKey.secretHash);
    if (!match) return null;

    apiKey.lastUsedAt = new Date();
    await this.apiKeysRepository.save(apiKey);

    return apiKey;
  }
}
