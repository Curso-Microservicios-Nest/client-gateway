import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
} from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { firstValueFrom } from 'rxjs';
import { Services } from 'src/enums/services.enum';
import { CreateOrderDto } from './dto/create-order.dto';
import { FilterOrdersDto } from './dto/filter-orders.dto';

@Controller('orders')
@ApiTags('Orders')
export class OrdersController {
  constructor(
    @Inject(Services.ORDER) private readonly ordersClient: ClientProxy,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new order' })
  @ApiCreatedResponse({ description: 'Order created successfully' })
  create(@Body() createOrder: CreateOrderDto) {
    return this.ordersClient.send('create', createOrder);
  }

  @Get()
  @ApiOperation({ summary: 'List all orders' })
  findAll(@Query() filters: FilterOrdersDto) {
    return this.ordersClient.send('findAll', filters);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an order by ID' })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    try {
      return await firstValueFrom(this.ordersClient.send('findOne', { id }));
    } catch (error) {
      throw new RpcException(error);
    }
  }
}
