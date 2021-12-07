import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  UsePipes,
  Req,
  Delete,
  Param,
} from '@nestjs/common';
import { ItemService } from './item.service';
import { CreateItemDto } from './dto/create-item.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { currentUser } from 'src/utils/currentUser.decorator';
import { CreatePublicItemDto } from './dto/create-public-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { validateBodyPipe } from 'src/utils/validateBody.pipe';

@Controller('item')
@UseGuards(JwtAuthGuard)
export class ItemController {
  constructor(private readonly itemService: ItemService) {}

  @Post('new')
  createPrivate(@Body() createItemDto: CreateItemDto, @currentUser() { id }) {
    return this.itemService.createItemtoList(createItemDto, id);
  }

  @Post('public/new')
  newPublic(@Body() createItemDto: CreatePublicItemDto, @currentUser() { id }) {
    return this.itemService.newPublic(createItemDto, id);
  }

  @Post('update')
  @UsePipes(new validateBodyPipe(UpdateItemDto))
  updateItem(@Body() body: UpdateItemDto[], @Req() { user: { id } }: any) {
    return this.itemService.updateItems(body, id);
  }
  @Delete(':id')
  deleteItem(@Param('id') itemId: number, @currentUser() { id }) {
    return this.itemService.deleteItem(itemId, id);
  }
  @Post(':id')
  itemDone(@Param('id') itemId: number, @currentUser() { id }) {
    return this.itemService.itemDone(itemId, id);
  }
}
