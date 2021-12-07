import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { User } from 'src/user/entities/user.entity';
import { Item } from 'src/item/entities/item.entity';
import { CustomItem } from 'src/custom-items/entities/custom-item.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Category, User, Item, CustomItem])],
  controllers: [CategoryController],
  providers: [CategoryService],
})
export class CategoryModule {}
