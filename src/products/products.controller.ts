import {
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
import { firstValueFrom } from 'rxjs';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { Services } from 'src/enums/services.enum';

@Controller('products')
@ApiTags('Products')
export class ProductsController {
  constructor(
    @Inject(Services.PRODUCT) private readonly productsClient: ClientProxy,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new product' })
  @ApiCreatedResponse({ description: 'Product created successfully' })
  create() {
    return 'This action adds a new product';
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
  update(@Param('id', ParseIntPipe) id: number) {
    return `This action updates a #${id} product ${id}`;
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a product by ID' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return `This action removes a #${id} product ${id}`;
  }

  @Delete('soft-delete/:id')
  @ApiOperation({ summary: 'Soft delete a product by ID' })
  softRemove(@Param('id', ParseIntPipe) id: number) {
    return `This action soft removes a #${id} product ${id}`;
  }
}
