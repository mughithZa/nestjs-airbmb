import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { PaymentsCreateChargeDto } from './dto/payments-create-charge.dto';
import { ClientProxy } from '@nestjs/microservices';
import { NOTIFICATIONS_SERVICE, PAYMENTS_SERVICE } from '@app/common';

@Injectable()
export class PaymentsService {
  private readonly stripe = new Stripe(
    this.configService.get('STRIPE_SECRET_KEY'),
    {},
  );

  constructor(
    private readonly configService: ConfigService,
    @Inject(NOTIFICATIONS_SERVICE)
    private readonly notificationService: ClientProxy,
  ) {}

  async createCharge({ card, amount, email }: PaymentsCreateChargeDto) {
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
    this.notificationService.emit('notify_email', {
      email,
      text: 'Your payment has done successfully!',
    });
    return paymentIntent;
  }
}
