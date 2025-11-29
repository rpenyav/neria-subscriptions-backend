// src/plans/plans.service.ts
import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Plan } from "./entities/plan.entity";
import { CreatePlanDto } from "./dto/create-plan.dto";
import { UpdatePlanDto } from "./dto/update-plan.dto";

@Injectable()
export class PlansService {
  constructor(
    @InjectRepository(Plan)
    private readonly plansRepository: Repository<Plan>
  ) {}

  async create(createPlanDto: CreatePlanDto): Promise<Plan> {
    const {
      name,
      description,
      priceMonth,
      currency = "EUR",
      features,
      isActive = true,
    } = createPlanDto;

    const plan = this.plansRepository.create({
      name,
      description,
      priceMonth: priceMonth.toString(),
      currency,
      features: features ?? null,
      isActive,
    });

    return this.plansRepository.save(plan);
  }

  async findAll(): Promise<Plan[]> {
    return this.plansRepository.find();
  }

  async findOne(id: number): Promise<Plan> {
    const plan = await this.plansRepository.findOne({ where: { id } });

    if (!plan) {
      throw new NotFoundException(`Plan with id ${id} not found`);
    }

    return plan;
  }

  async update(id: number, updatePlanDto: UpdatePlanDto): Promise<Plan> {
    const plan = await this.findOne(id);

    if (typeof updatePlanDto.priceMonth === "number") {
      (updatePlanDto as any).priceMonth = updatePlanDto.priceMonth.toString();
    }

    const updated = Object.assign(plan, {
      ...updatePlanDto,
      features:
        typeof updatePlanDto.features !== "undefined"
          ? updatePlanDto.features
          : plan.features,
    });

    return this.plansRepository.save(updated);
  }

  async remove(id: number): Promise<void> {
    const plan = await this.findOne(id);
    await this.plansRepository.remove(plan);
  }
}
