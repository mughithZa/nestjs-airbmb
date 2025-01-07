import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { PaymentsCreateChargeDto } from './dto/payments-create-charge.dto';

@Injectable()
export class PaymentsService {
  private readonly stripe = new Stripe(
    this.configService.get('STRIPE_SECRET_KEY'),
    {},
  );

  constructor(private readonly configService: ConfigService) {}

  async createCharge({ card, amount }: PaymentsCreateChargeDto) {
    console.log(card);

    const paymentIntent = await this.stripe.paymentIntents.create({
      customer: 'cus_RXoRsGRRtqX2I1',
      payment_method: 'pm_1QeipY2fJLZvumTUWw6wC2Ul',
      amount: amount * 100,
      currency: 'usd',
      confirm: true,
      return_url: 'https://yourdomain.com/payment-complete',
      automatic_payment_methods: { enabled: true },
    });
    return paymentIntent;
  }
}
