import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { NotFoundError } from 'rxjs';
import { newItems } from 'src/category/category.service';
import { In, Repository } from 'typeorm';
import { CreateListDto } from './dto/create-list.dto';
import { UpdateListDto } from './dto/update-list.dto';
import { List } from './entities/list.entity';

@Injectable()
export class ListService {
  constructor(
    @InjectRepository(List)
    private readonly listRepo: Repository<List>,
  ) {}

  async create({ listName }: CreateListDto, id: number) {
    const hasActive = await this.listRepo.findOne({
      where: { ownerId: id, status: 'active' },
    });
    if (hasActive)
      throw new UnprocessableEntityException(
        'user cant have more than 1 active list',
      );
    return this.listRepo.save(
      this.listRepo.create({
        listName,
        ownerId: id,
        status: 'active',
      }),
    );
  }

  findAll(id: number) {
    return this.listRepo.find({
      where: [
        { ownerId: id, status: 'completed' },
        { ownerId: id, status: 'canceled' },
      ],
    });
  }

  async findOne(listId: number, id: number) {
    if (!listId) throw new BadRequestException('bad list ID');
    console.log('listid', listId, 'id', id);
    const list = await this.listRepo.findOne({
      where: { id: listId },
      relations: ['items', 'items.category'],
    });
    if (!list) throw new NotFoundException('list with the given id not found');
    if (list.ownerId !== id)
      throw new UnauthorizedException("you cant view other's lists");

    const categories: newItems[] = [];

    list.items.forEach((item, index) => {
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

    return { ...list, items: categories };
  }

  async getCurrentActive(id: number) {
    const list = await this.listRepo.findOne({
      relations: ['items', 'items.category'],
      where: { ownerId: id, status: 'active' },
    });
    if (!list) throw new NotFoundException('you dont have an active list');
    const categories: newItems[] = [];

    list.items.forEach((item, index) => {
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

    return { ...list, items: categories };
  }
  async cancelCurrentActive(id: number) {
    const hasActive = await this.listRepo.findOne({
      where: { ownerId: id, status: 'active' },
    });

    if (!hasActive)
      throw new BadRequestException('you dont have an active list to cancel');

    return this.listRepo.update(hasActive, { status: 'canceled' });
  }
  async completeCurrentActive(id: number) {
    const hasActive = await this.listRepo.findOne({
      where: { ownerId: id, status: 'active' },
    });

    if (!hasActive)
      throw new BadRequestException('you dont have an active list to complete');

    return this.listRepo.update(hasActive, { status: 'completed' });
  }

  async updateCurrentActive({ listName }: UpdateListDto, id: number) {
    const hasActive = await this.listRepo.findOne({
      where: { ownerId: id, status: 'active' },
    });

    if (!hasActive)
      throw new BadRequestException('you dont have an active list to complete');

    return this.listRepo.update(hasActive, { listName });
  }
}
