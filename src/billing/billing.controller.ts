import { Controller, Get, Param } from "@nestjs/common";
import { BillingService } from "./billing.service";

@Controller("billing")
export class BillingController {
  constructor(private readonly billingService: BillingService) {}

  @Get("payments")
  findAllPayments() {
    return this.billingService.findAllPayments();
  }

  @Get("payments/:id")
  findPayment(@Param("id") id: string) {
    return this.billingService.findPayment(+id);
  }
}
