import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { firstValueFrom } from 'rxjs';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { Services } from 'src/config/services.enum';
import { CreateOrderDto } from './dto/create-order.dto';
import { FilterOrdersDto } from './dto/filter-orders.dto';
import { StatusDto } from './dto/status.dto';

@Controller('orders')
@ApiTags('Orders')
export class OrdersController {
  constructor(
    @Inject(Services.NATS_SERVICE) private readonly client: ClientProxy,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new order' })
  @ApiCreatedResponse({ description: 'Order created successfully' })
  create(@Body() createOrder: CreateOrderDto) {
    return this.client.send('create', createOrder);
  }

  @Get()
  @ApiOperation({ summary: 'List all orders' })
  async findAll(@Query() filters: FilterOrdersDto) {
    try {
      return await firstValueFrom(this.client.send('findAll', filters));
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @Get('status/:status')
  @ApiOperation({ summary: 'List all orders by status' })
  async findAllByStatus(
    @Param() statusDto: StatusDto,
    @Query() pagination: PaginationDto,
  ) {
    return this.client.send('findAll', {
      status: statusDto.status,
      ...pagination,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an order by ID' })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    try {
      return await firstValueFrom(this.client.send('findOne', { id }));
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an order status' })
  changeStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() statusDto: StatusDto,
  ) {
    try {
      return this.client.send('changeStatus', {
        id,
        status: statusDto.status,
      });
    } catch (error) {
      throw new RpcException(error);
    }
  }
}
