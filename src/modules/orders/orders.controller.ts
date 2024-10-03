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
  UseGuards,
} from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { firstValueFrom } from 'rxjs';

import { PaginationDto } from 'src/common/dto/pagination.dto';
import { Services } from 'src/enums';
import { JwtAuthGuard } from '../auth/guards';
import { CreateOrderDto } from './dto/create-order.dto';
import { FilterOrdersDto } from './dto/filter-orders.dto';
import { StatusDto } from './dto/status.dto';

@Controller('orders')
@ApiTags('Orders')
export class OrdersController {
  constructor(
    @Inject(Services.NATS_SERVICE) private readonly client: ClientProxy,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiOperation({ summary: 'Create a new order' })
  @ApiCreatedResponse({ description: 'Order created successfully' })
  @ApiUnauthorizedResponse({ description: 'Invalid token' })
  @ApiBearerAuth()
  create(@Body() createOrder: CreateOrderDto) {
    return this.client.send('create', createOrder);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiOperation({ summary: 'List all orders' })
  @ApiUnauthorizedResponse({ description: 'Invalid token' })
  @ApiBearerAuth()
  async findAll(@Query() filters: FilterOrdersDto) {
    try {
      return await firstValueFrom(this.client.send('findAll', filters));
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('status/:status')
  @ApiOperation({ summary: 'List all orders by status' })
  @ApiUnauthorizedResponse({ description: 'Invalid token' })
  @ApiBearerAuth()
  async findAllByStatus(
    @Param() statusDto: StatusDto,
    @Query() pagination: PaginationDto,
  ) {
    return this.client.send('findAll', {
      status: statusDto.status,
      ...pagination,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @ApiOperation({ summary: 'Get an order by ID' })
  @ApiUnauthorizedResponse({ description: 'Invalid token' })
  @ApiBearerAuth()
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    try {
      return await firstValueFrom(this.client.send('findOne', { id }));
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @ApiOperation({ summary: 'Update an order status' })
  @ApiUnauthorizedResponse({ description: 'Invalid token' })
  @ApiBearerAuth()
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
