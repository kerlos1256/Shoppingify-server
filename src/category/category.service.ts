import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CustomItem } from 'src/custom-items/entities/custom-item.entity';
import { Item } from 'src/item/entities/item.entity';
import { User } from 'src/user/entities/user.entity';
import { DeepPartial, Repository } from 'typeorm';
import { Category } from './entities/category.entity';

export interface newItems extends DeepPartial<Category> {
  items: DeepPartial<Item>[];
}

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepo: Repository<Category>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(Item)
    private readonly itemRepo: Repository<Item>,
    @InjectRepository(CustomItem)
    private readonly customItemRepo: Repository<CustomItem>,
  ) {}

  async createPublic(name: string, id: number) {
    const user = await this.userRepo.findOne(id);
    if (!user)
      throw new NotFoundException('user with the given token not found');

    if (user.role !== 'admin')
      throw new BadRequestException(
        'only admins can add new public categories',
      );

    return this.categoryRepo.save(
      this.categoryRepo.create({
        name,
        state: 'public',
      }),
    );
  }

  getPublic() {
    return this.categoryRepo.find({ where: { state: 'public' } });
  }

  async getPublicWithItems(): Promise<any> {
    const items = await this.itemRepo.find({
      relations: ['category'],
      where: {
        state: 'public',
      },
    });
    const categories: newItems[] = [];

    items.forEach((item, index) => {
      const cateExists = categories.findIndex(
        (cate) => cate.id === item.categoryId,
      );
      if (cateExists > -1) {
        const { category, ...rest } = item;
        categories[cateExists].items.push(rest);
      } else {
        const { category, ...rest } = item;
        categories.push({ ...category, items: [rest] });
      }
    });

    return categories;
  }

  getPrivate(id: number) {
    return this.categoryRepo.find({
      relations: ['items'],
      where: {
        ownerId: id,
        state: 'private',
      },
    });
  }

  async getPrivateWithItems(id: number): Promise<newItems[]> {
    const items = await this.customItemRepo.find({
      relations: ['category'],
      where: {
        ownerId: id,
      },
    });

    const categories: newItems[] = [];

    items.forEach((item, index) => {
      const cateExists = categories.findIndex(
        (cate) => cate.id === item.categoryId,
      );
      if (cateExists > -1) {
        const { category, ...rest } = item;
        categories[cateExists].items.push(rest);
      } else {
        const { category, ...rest } = item;
        categories.push({ ...category, items: [rest] });
      }
    });
    return categories;
  }
}
