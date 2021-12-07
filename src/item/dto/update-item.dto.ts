import { PartialType } from '@nestjs/mapped-types';
import { IsNumber } from 'class-validator';
import { CreateItemDto } from './create-item.dto';

export class UpdateItemDto {
  @IsNumber()
  itemId: number = null;
  @IsNumber()
  quantity: number = null;
}
