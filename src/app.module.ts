import { Module } from '@nestjs/common';

import { AuthModule } from './modules/auth/auth.module';
import { OrdersModule } from './modules/orders/orders.module';
import { ProductsModule } from './modules/products/products.module';
import { NatsModule } from './modules/transports/nats.module';

@Module({
  imports: [ProductsModule, OrdersModule, NatsModule, AuthModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
