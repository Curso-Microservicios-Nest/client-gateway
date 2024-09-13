import { Module } from '@nestjs/common';

import { NatsModule } from 'src/modules/transports/nats.module';
import { OrdersController } from './orders.controller';

@Module({
  controllers: [OrdersController],
  providers: [],
  imports: [NatsModule],
})
export class OrdersModule {}