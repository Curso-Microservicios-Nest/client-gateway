import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';

import { config } from 'src/config/config';
import { Services } from 'src/enums/services.enum';
import { ProductsController } from './products.controller';

@Module({
  controllers: [ProductsController],
  providers: [],
  imports: [
    ClientsModule.register([
      {
        name: Services.PRODUCT,
        transport: Transport.TCP,
        options: {
          host: config.microservices.products.host,
          port: config.microservices.products.port,
        },
      },
    ]),
  ],
})
export class ProductsModule {}
