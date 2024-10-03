import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { catchError, firstValueFrom } from 'rxjs';

import { PaginationDto } from 'src/common/dto/pagination.dto';
import { Services } from 'src/enums';
import { JwtAuthGuard } from '../auth/guards';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('products')
@ApiTags('Products')
export class ProductsController {
  constructor(
    @Inject(Services.NATS_SERVICE) private readonly client: ClientProxy,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiOperation({ summary: 'Create a new product' })
  @ApiCreatedResponse({ description: 'Product created successfully' })
  @ApiUnauthorizedResponse({ description: 'Invalid token' })
  @ApiBearerAuth()
  async create(@Body() createProduct: CreateProductDto) {
    return this.client.send({ cmd: 'create' }, createProduct);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiOperation({ summary: 'List all products' })
  @ApiOkResponse({ description: 'Products listed successfully' })
  @ApiUnauthorizedResponse({ description: 'Invalid token' })
  @ApiBearerAuth()
  findAll(@Query() pagination: PaginationDto) {
    return this.client.send({ cmd: 'findAll' }, pagination);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @ApiOperation({ summary: 'Get a product by ID' })
  @ApiOkResponse({ description: 'Product found successfully' })
  @ApiUnauthorizedResponse({ description: 'Invalid token' })
  @ApiBearerAuth()
  async findOne(@Param('id', ParseIntPipe) id: number) {
    try {
      return await firstValueFrom(this.client.send({ cmd: 'findOne' }, { id }));
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @ApiOperation({ summary: 'Update a product by ID' })
  @ApiUnauthorizedResponse({ description: 'Invalid token' })
  @ApiBearerAuth()
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProduct: UpdateProductDto,
  ) {
    try {
      return await firstValueFrom(
        this.client.send({ cmd: 'update' }, { id, ...updateProduct }),
      );
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a product by ID' })
  @ApiUnauthorizedResponse({ description: 'Invalid token' })
  @ApiBearerAuth()
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.client.send({ cmd: 'remove' }, { id }).pipe(
      catchError((err) => {
        throw new RpcException(err);
      }),
    );
  }

  @UseGuards(JwtAuthGuard)
  @Delete('soft-delete/:id')
  @ApiOperation({ summary: 'Soft delete a product by ID' })
  @ApiUnauthorizedResponse({ description: 'Invalid token' })
  @ApiBearerAuth()
  softRemove(@Param('id', ParseIntPipe) id: number) {
    return this.client.send({ cmd: 'softRemove' }, { id }).pipe(
      catchError((err) => {
        throw new RpcException(err);
      }),
    );
  }
}
