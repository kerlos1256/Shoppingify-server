import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { currentUser } from 'src/utils/currentUser.decorator';
import { CategoryService, newItems } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post('public/new')
  @UseGuards(JwtAuthGuard)
  createPublic(
    @Body() createCategoryDto: CreateCategoryDto,
    @currentUser() { id },
  ) {
    return this.categoryService.createPublic(createCategoryDto.name, id);
  }

  @Get('public/withitems')
  getPublicWithItems() {
    return this.categoryService.getPublicWithItems();
  }
  @Get('public')
  getPublic() {
    return this.categoryService.getPublic();
  }

  @Get('private')
  @UseGuards(JwtAuthGuard)
  getPrivate(@currentUser() { id }) {
    return this.categoryService.getPrivate(id);
  }

  @Get('private/withitems')
  @UseGuards(JwtAuthGuard)
  getPrivateWithItems(@currentUser() { id }): Promise<newItems[]> {
    return this.categoryService.getPrivateWithItems(id);
  }
}
