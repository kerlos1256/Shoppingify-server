import { Module } from '@nestjs/common';
import { ItemService } from './item.service';
import { ItemController } from './item.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { List } from 'src/list/entities/list.entity';
import { Item } from './entities/item.entity';
import { Category } from 'src/category/entities/category.entity';
import { User } from 'src/user/entities/user.entity';
import { CustomItem } from 'src/custom-items/entities/custom-item.entity';

@Module({
  imports: [TypeOrmModule.forFeature([List, Item, Category, User, CustomItem])],
  controllers: [ItemController],
  providers: [ItemService],
})
export class ItemModule {}
