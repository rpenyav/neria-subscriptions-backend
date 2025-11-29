import { Injectable } from "@nestjs/common";

@Injectable()
export class BillingService {
  // TODO: luego entidad Payment/Invoice + integración con pasarela de pago

  findAllPayments() {
    return [
      {
        id: 1,
        subscriptionId: 1,
        amount: 99,
        currency: "EUR",
        status: "paid",
        paidAt: new Date().toISOString(),
        provider: "manual",
      },
    ];
  }

  findPayment(id: number) {
    return {
      id,
      subscriptionId: 1,
      amount: 49,
      currency: "EUR",
      status: "paid",
      paidAt: new Date().toISOString(),
      provider: "manual",
    };
  }
}
