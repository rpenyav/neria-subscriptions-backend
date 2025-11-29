// src/api-keys/api-keys.controller.ts
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from "@nestjs/common";
import { ApiKeysService } from "./api-keys.service";
import { CreateApiKeyDto } from "./dto/create-api-key.dto";
import { UpdateApiKeyDto } from "./dto/update-api-key.dto";

@Controller("api-keys")
export class ApiKeysController {
  constructor(private readonly apiKeysService: ApiKeysService) {}

  @Post()
  async create(@Body() createApiKeyDto: CreateApiKeyDto) {
    // Devolvemos la ApiKey y el secret solo esta vez
    return this.apiKeysService.create(createApiKeyDto);
  }

  @Get()
  findAll() {
    return this.apiKeysService.findAll();
  }

  @Get(":id")
  findOne(@Param("id", ParseIntPipe) id: number) {
    return this.apiKeysService.findOne(id);
  }

  @Patch(":id")
  update(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateApiKeyDto: UpdateApiKeyDto
  ) {
    return this.apiKeysService.update(id, updateApiKeyDto);
  }

  @Post(":id/revoke")
  revoke(@Param("id", ParseIntPipe) id: number) {
    return this.apiKeysService.revoke(id);
  }

  @Delete(":id")
  async remove(@Param("id", ParseIntPipe) id: number) {
    // opcional: podrías implementar borrado físico o lógico;
    // de momento no lo implementamos para no liar el dominio.
    const key = await this.apiKeysService.revoke(id);
    return key;
  }
}
