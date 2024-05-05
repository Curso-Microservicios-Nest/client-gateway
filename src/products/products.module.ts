import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';

import { envs } from 'src/config';
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
          host: envs.microservices.products.host,
          port: envs.microservices.products.port,
        },
      },
    ]),
  ],
})
export class ProductsModule {}
