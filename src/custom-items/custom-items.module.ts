import { Module } from '@nestjs/common';
import { CustomItemsService } from './custom-items.service';
import { CustomItemsController } from './custom-items.controller';

@Module({
  controllers: [CustomItemsController],
  providers: [CustomItemsService]
})
export class CustomItemsModule {}
