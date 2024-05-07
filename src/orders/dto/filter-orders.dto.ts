import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { OrderStatus } from '../enums/order.enum';

export class FilterOrdersDto extends PaginationDto {
  @ApiProperty({
    description: 'Status of the order',
    enum: OrderStatus,
    required: false,
  })
  @IsEnum(OrderStatus, {
    message: `Status must be a valid enum value: ${Object.values(OrderStatus).join(', ')}`,
  })
  @IsOptional()
  status?: OrderStatus;
}
