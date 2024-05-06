import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';

import { envs } from 'src/config';
import { Services } from 'src/enums/services.enum';
import { OrdersController } from './orders.controller';

@Module({
  controllers: [OrdersController],
  providers: [],
  imports: [
    ClientsModule.register([
      {
        name: Services.ORDER,
        transport: Transport.TCP,
        options: {
          host: envs.microservices.orders.host,
          port: envs.microservices.orders.port,
        },
      },
    ]),
  ],
})
export class OrdersModule {}
