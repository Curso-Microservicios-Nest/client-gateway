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
} from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { catchError, firstValueFrom } from 'rxjs';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { Services } from 'src/enums/services.enum';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('products')
@ApiTags('Products')
export class ProductsController {
  constructor(
    @Inject(Services.PRODUCT) private readonly productsClient: ClientProxy,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new product' })
  @ApiCreatedResponse({ description: 'Product created successfully' })
  async create(@Body() createProduct: CreateProductDto) {
    return this.productsClient.send({ cmd: 'create' }, createProduct);
  }

  @Get()
  @ApiOperation({ summary: 'List all products' })
  findAll(@Query() pagination: PaginationDto) {
    return this.productsClient.send({ cmd: 'findAll' }, pagination);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a product by ID' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    try {
      return await firstValueFrom(
        this.productsClient.send({ cmd: 'findOne' }, { id }),
      );
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a product by ID' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProduct: UpdateProductDto,
  ) {
    try {
      return await firstValueFrom(
        this.productsClient.send({ cmd: 'update' }, { id, ...updateProduct }),
      );
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a product by ID' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.productsClient.send({ cmd: 'remove' }, { id }).pipe(
      catchError((err) => {
        throw new RpcException(err);
      }),
    );
  }

  @Delete('soft-delete/:id')
  @ApiOperation({ summary: 'Soft delete a product by ID' })
  softRemove(@Param('id', ParseIntPipe) id: number) {
    return this.productsClient.send({ cmd: 'softRemove' }, { id }).pipe(
      catchError((err) => {
        throw new RpcException(err);
      }),
    );
  }
}
