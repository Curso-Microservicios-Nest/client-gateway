import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
} from 'class-validator';
import { OrderStatus } from '../enums/order.enum';

export class CreateOrderDto {
  @ApiProperty({ description: 'Id of the user', example: 1000 })
  @IsPositive()
  @IsNumber()
  @IsNotEmpty()
  readonly totalAmount: number;

  @ApiProperty({ description: 'Total items in the order', example: 3 })
  @IsPositive()
  @IsNumber()
  @IsNotEmpty()
  readonly totalItems: number;

  @ApiProperty({ description: 'Status of the order', example: 'PENDING' })
  @IsEnum(OrderStatus, {
    message: `Status must be one of the following: ${OrderStatus}`,
  })
  @IsOptional()
  readonly status: OrderStatus = OrderStatus.PENDING;

  @ApiProperty({ description: 'Paid status of the order', example: 'false' })
  @IsBoolean()
  @IsOptional()
  readonly paid: boolean = false;
}
