import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { OrderStatus } from '../enums/order.enum';

export class StatusDto {
  @ApiProperty({
    description: 'Status of the order',
    enum: OrderStatus,
    required: false,
  })
  @IsEnum(OrderStatus, {
    message: `Status must be a valid enum value: ${Object.values(OrderStatus).join(', ')}`,
  })
  @IsNotEmpty()
  status?: OrderStatus;
}
