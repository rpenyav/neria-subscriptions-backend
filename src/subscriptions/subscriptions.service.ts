// src/subscriptions/subscriptions.service.ts
import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Subscription } from "./entities/subscription.entity";
import { Client } from "../clients/entities/client.entity";
import { Plan } from "../plans/entities/plan.entity";
import { CreateSubscriptionDto } from "./dto/create-subscription.dto";
import { UpdateSubscriptionDto } from "./dto/update-subscription.dto";

@Injectable()
export class SubscriptionsService {
  constructor(
    @InjectRepository(Subscription)
    private readonly subscriptionsRepository: Repository<Subscription>,
    @InjectRepository(Client)
    private readonly clientsRepository: Repository<Client>,
    @InjectRepository(Plan)
    private readonly plansRepository: Repository<Plan>
  ) {}

  private addOneMonth(date: Date): Date {
    const d = new Date(date);
    d.setMonth(d.getMonth() + 1);
    return d;
  }

  async create(
    createSubscriptionDto: CreateSubscriptionDto
  ): Promise<Subscription> {
    const { clientId, planId } = createSubscriptionDto;

    const client = await this.clientsRepository.findOne({
      where: { id: clientId },
    });
    if (!client) {
      throw new NotFoundException(`Client with id ${clientId} not found`);
    }

    const plan = await this.plansRepository.findOne({ where: { id: planId } });
    if (!plan) {
      throw new NotFoundException(`Plan with id ${planId} not found`);
    }

    const now = new Date();
    const startAt = createSubscriptionDto.startAt
      ? new Date(createSubscriptionDto.startAt)
      : now;

    const currentPeriodStart = createSubscriptionDto.currentPeriodStart
      ? new Date(createSubscriptionDto.currentPeriodStart)
      : startAt;

    const currentPeriodEnd = createSubscriptionDto.currentPeriodEnd
      ? new Date(createSubscriptionDto.currentPeriodEnd)
      : this.addOneMonth(currentPeriodStart);

    const subscription = this.subscriptionsRepository.create({
      clientId,
      client,
      planId,
      plan,
      status: createSubscriptionDto.status ?? "active",
      startAt,
      currentPeriodStart,
      currentPeriodEnd,
      cancelAtPeriodEnd: createSubscriptionDto.cancelAtPeriodEnd ?? false,
      canceledAt: null,
    });

    return this.subscriptionsRepository.save(subscription);
  }

  async findAll(): Promise<Subscription[]> {
    return this.subscriptionsRepository.find({
      relations: ["client", "plan"],
    });
  }

  async findOne(id: number): Promise<Subscription> {
    const subscription = await this.subscriptionsRepository.findOne({
      where: { id },
      relations: ["client", "plan"],
    });

    if (!subscription) {
      throw new NotFoundException(`Subscription with id ${id} not found`);
    }

    return subscription;
  }

  async update(
    id: number,
    updateSubscriptionDto: UpdateSubscriptionDto
  ): Promise<Subscription> {
    const subscription = await this.findOne(id);

    if (
      typeof updateSubscriptionDto.clientId === "number" &&
      updateSubscriptionDto.clientId !== subscription.clientId
    ) {
      const client = await this.clientsRepository.findOne({
        where: { id: updateSubscriptionDto.clientId },
      });
      if (!client) {
        throw new NotFoundException(
          `Client with id ${updateSubscriptionDto.clientId} not found`
        );
      }
      subscription.clientId = client.id;
      subscription.client = client;
    }

    if (
      typeof updateSubscriptionDto.planId === "number" &&
      updateSubscriptionDto.planId !== subscription.planId
    ) {
      const plan = await this.plansRepository.findOne({
        where: { id: updateSubscriptionDto.planId },
      });
      if (!plan) {
        throw new NotFoundException(
          `Plan with id ${updateSubscriptionDto.planId} not found`
        );
      }
      subscription.planId = plan.id;
      subscription.plan = plan;
    }

    if (updateSubscriptionDto.status) {
      subscription.status = updateSubscriptionDto.status;
    }

    if (updateSubscriptionDto.startAt) {
      subscription.startAt = new Date(updateSubscriptionDto.startAt);
    }

    if (updateSubscriptionDto.currentPeriodStart) {
      subscription.currentPeriodStart = new Date(
        updateSubscriptionDto.currentPeriodStart
      );
    }

    if (updateSubscriptionDto.currentPeriodEnd) {
      subscription.currentPeriodEnd = new Date(
        updateSubscriptionDto.currentPeriodEnd
      );
    }

    if (typeof updateSubscriptionDto.cancelAtPeriodEnd === "boolean") {
      subscription.cancelAtPeriodEnd = updateSubscriptionDto.cancelAtPeriodEnd;
    }

    if (updateSubscriptionDto.canceledAt) {
      subscription.canceledAt = new Date(updateSubscriptionDto.canceledAt);
    }

    return this.subscriptionsRepository.save(subscription);
  }

  async remove(id: number): Promise<void> {
    const subscription = await this.findOne(id);
    await this.subscriptionsRepository.remove(subscription);
  }
}
