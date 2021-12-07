import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { NotFoundError } from 'rxjs';
import { Category } from 'src/category/entities/category.entity';
import { CustomItem } from 'src/custom-items/entities/custom-item.entity';
import { List } from 'src/list/entities/list.entity';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateItemDto } from './dto/create-item.dto';
import { CreatePublicItemDto } from './dto/create-public-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { Item } from './entities/item.entity';

@Injectable()
export class ItemService {
  constructor(
    @InjectRepository(Item)
    private readonly itemRepo: Repository<Item>,
    @InjectRepository(Category)
    private readonly categoryRepo: Repository<Category>,
    @InjectRepository(List)
    private readonly listRepo: Repository<List>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(CustomItem)
    private readonly customItemRepo: Repository<CustomItem>,
  ) {}

  async createItemtoList({ name, category }: CreateItemDto, id: number) {
    const list = await this.listRepo.findOne({
      where: { ownerId: id, status: 'active' },
    });

    if (!list) throw new BadRequestException('you dont have an active list');

    if (!list) throw new NotFoundError('list with the given id not found');

    const ctgry = await this.categoryRepo.findOne({ name: category });

    const itemPublicily =
      (
        await this.itemRepo.find({
          where: {
            name,
            state: 'public',
          },
        })
      ).length > 0;

    const customItemExists =
      (await this.customItemRepo.find({ where: { ownerId: id, name } }))
        .length > 0;

    if (!ctgry) {
      const newCategory = await this.categoryRepo.save(
        this.categoryRepo.create({
          name: category,
          ownerId: id,
        }),
      );
      if (!customItemExists && !itemPublicily) {
        this.customItemRepo.save(
          this.customItemRepo.create({
            categoryId: newCategory.id,
            name,
            ownerId: id,
          }),
        );
      }
      return this.itemRepo.save(
        this.itemRepo.create({
          categoryId: newCategory.id,
          name,
          quantity: 1,
          listId: list.id,
          userId: id,
        }),
      );
    }
    if (!customItemExists && !itemPublicily) {
      this.customItemRepo.save(
        this.customItemRepo.create({
          categoryId: ctgry.id,
          name,
          ownerId: id,
        }),
      );
    }

    return this.itemRepo.save(
      this.itemRepo.create({
        category: ctgry,
        name,
        quantity: 1,
        listId: list.id,
        userId: id,
      }),
    );
  }

  async newPublic({ name, category }: CreatePublicItemDto, id: number) {
    const user = await this.userRepo.findOne(id);

    if (!user)
      throw new BadRequestException('user with the given token was not found');

    if (user.role !== 'admin')
      throw new UnauthorizedException('only admins can create public items');

    const ctgry = await this.categoryRepo.findOne({
      name: category,
      state: 'public',
    });

    if (!ctgry)
      throw new NotFoundException('no public category with this name found ');

    return this.itemRepo.save(
      this.itemRepo.create({
        name,
        category: ctgry,
        state: 'public',
      }),
    );
  }

  getPrivate(id: number) {
    return this.categoryRepo.find({
      where: { ownerId: id, state: 'private' },
      relations: ['items'],
    });
  }

  async updateItems(body: UpdateItemDto[], id: number) {
    const hasActive = await this.listRepo.findOne({
      where: { ownerId: id, status: 'active' },
    });
    if (!hasActive)
      throw new BadRequestException('you dont have an active list');

    if (!Array.isArray(body))
      throw new BadRequestException('body must be an array of item/items');

    body.map(async (Item) => {
      const { itemId, ...rest } = Item;

      const item = await this.itemRepo.findOne({
        where: { id: itemId, listId: hasActive.id },
      });

      if (!item) return;
      this.itemRepo.update(item, rest);
    });

    return true;
  }

  async deleteItem(itemId: number, id: number) {
    const hasActive = await this.listRepo.findOne({
      where: { ownerId: id, status: 'active' },
    });
    if (!hasActive)
      throw new BadRequestException('you dont have an active list');

    const item = await this.itemRepo.findOne({ id: itemId });

    if (!item)
      throw new BadRequestException('item with the given id was not found');

    if (item.listId !== hasActive.id)
      throw new BadRequestException(
        'you cant delete items not in your current active list',
      );

    return this.itemRepo.delete(item);
  }

  async itemDone(itemId: number, id: number) {
    const hasActive = await this.listRepo.findOne({
      where: { ownerId: id, status: 'active' },
    });
    if (!hasActive)
      throw new BadRequestException('you dont have an active list');

    const item = await this.itemRepo.findOne({ id: itemId });

    if (!item)
      throw new BadRequestException('item with the given id was not found');

    if (item.listId !== hasActive.id)
      throw new BadRequestException(
        'you cant done/undone items not in your current active list',
      );

    return this.itemRepo.update(item, { done: !item.done });
  }
}
