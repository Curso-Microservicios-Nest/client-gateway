import { Module } from '@nestjs/common';

import { NatsModule } from 'src/modules/transports/nats.module';
import { ProductsController } from './products.controller';

@Module({
  controllers: [ProductsController],
  providers: [],
  imports: [NatsModule],
})
export class ProductsModule {}