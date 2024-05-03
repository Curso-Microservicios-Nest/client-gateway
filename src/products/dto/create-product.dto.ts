import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  Min,
} from 'class-validator';

export class CreateProductDto {
  @ApiProperty({
    description: 'Product name',
    example: 'Iphone 15 pro max',
  })
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @ApiProperty({
    description: 'Product description',
    example: 'The best phone in the market',
  })
  @IsNotEmpty()
  readonly description: string;

  @ApiProperty({
    description: 'Product price',
    example: 999.99,
  })
  @IsNumber({ maxDecimalPlaces: 4 })
  @IsPositive()
  @IsNotEmpty()
  readonly price: number;

  @ApiProperty({
    description: 'Product stock',
    example: 100,
  })
  @Min(0)
  @IsNotEmpty()
  readonly stock: number;
}
