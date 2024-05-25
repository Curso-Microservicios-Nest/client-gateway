import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsPositive } from 'class-validator';

export class OrderItemDto {
  @ApiProperty({
    description: 'Product ID',
    example: 1,
    required: true,
  })
  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  productId: number;

  @ApiProperty({
    description: 'Quantity of the product',
    example: 10,
    required: true,
  })
  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  quantity: number;

  @ApiProperty({
    description: 'Price of the product',
    example: 1000.0,
    required: true,
  })
  @IsNumber()
  @IsNotEmpty()
  price: number;
}
