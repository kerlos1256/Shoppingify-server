import { Injectable } from '@nestjs/common';
import { CreateCustomItemDto } from './dto/create-custom-item.dto';
import { UpdateCustomItemDto } from './dto/update-custom-item.dto';

@Injectable()
export class CustomItemsService {
  create(createCustomItemDto: CreateCustomItemDto) {
    return 'This action adds a new customItem';
  }

  findAll() {
    return `This action returns all customItems`;
  }

  findOne(id: number) {
    return `This action returns a #${id} customItem`;
  }

  update(id: number, updateCustomItemDto: UpdateCustomItemDto) {
    return `This action updates a #${id} customItem`;
  }

  remove(id: number) {
    return `This action removes a #${id} customItem`;
  }
}
