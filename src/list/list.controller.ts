import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { ListService } from './list.service';
import { CreateListDto } from './dto/create-list.dto';
import { UpdateListDto } from './dto/update-list.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { currentUser } from 'src/utils/currentUser.decorator';

@Controller('list')
@UseGuards(JwtAuthGuard)
export class ListController {
  constructor(private readonly listService: ListService) {}

  @Post('new')
  create(@Body() createListDto: CreateListDto, @currentUser() user) {
    return this.listService.create(createListDto, user.id);
  }

  @Get('current')
  getCurrent(@currentUser() { id }) {
    return this.listService.getCurrentActive(id);
  }

  @Get()
  getAllOwn(@currentUser() { id }) {
    return this.listService.findAll(id);
  }

  @Get(':id')
  findOne(@Param('id') listId: number, @currentUser() { id }) {
    return this.listService.findOne(listId, id);
  }

  @Post('current/cancel')
  cancelCurrent(@currentUser() { id }) {
    return this.listService.cancelCurrentActive(id);
  }

  @Post('current/complete')
  completeCurrent(@currentUser() { id }) {
    return this.listService.completeCurrentActive(id);
  }

  @Post('current/update')
  updateCurrent(@Body() body: UpdateListDto, @currentUser() { id }) {
    return this.listService.updateCurrentActive(body, id);
  }
}
