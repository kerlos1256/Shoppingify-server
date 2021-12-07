import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CustomItemsService } from './custom-items.service';
import { CreateCustomItemDto } from './dto/create-custom-item.dto';
import { UpdateCustomItemDto } from './dto/update-custom-item.dto';

@Controller('custom-items')
export class CustomItemsController {
  constructor(private readonly customItemsService: CustomItemsService) {}

  @Post()
  create(@Body() createCustomItemDto: CreateCustomItemDto) {
    return this.customItemsService.create(createCustomItemDto);
  }

  @Get()
  findAll() {
    return this.customItemsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.customItemsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCustomItemDto: UpdateCustomItemDto) {
    return this.customItemsService.update(+id, updateCustomItemDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.customItemsService.remove(+id);
  }
}
