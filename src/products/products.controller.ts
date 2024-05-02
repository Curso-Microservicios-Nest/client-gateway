import {
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { number } from 'joi';

@Controller('products')
@ApiTags('Products')
export class ProductsController {
  constructor() {}

  @Post()
  @ApiOperation({ summary: 'Create a new product' })
  @ApiCreatedResponse({ description: 'Product created successfully' })
  create() {
    return 'This action adds a new product';
  }

  @Get()
  @ApiOperation({ summary: 'List all products' })
  findAll() {
    return 'This action returns all products';
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a product by ID' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return `This action returns a #${id} product ${number}`;
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a product by ID' })
  update(@Param('id', ParseIntPipe) id: number) {
    return `This action updates a #${id} product ${number}`;
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a product by ID' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return `This action removes a #${id} product ${number}`;
  }

  @Delete('soft-delete/:id')
  @ApiOperation({ summary: 'Soft delete a product by ID' })
  softRemove(@Param('id', ParseIntPipe) id: number) {
    return `This action soft removes a #${id} product ${number}`;
  }
}
