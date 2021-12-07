import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ListModule } from './list/list.module';
import { UserModule } from './user/user.module';
import { CategoryModule } from './category/category.module';
import { ItemModule } from './item/item.module';
import { config } from './typeormConfig';
import { AuthModule } from './auth/auth.module';
import { PublicModule } from './public/public.module';
import { CustomItemsModule } from './custom-items/custom-items.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(config),
    ListModule,
    UserModule,
    CategoryModule,
    ItemModule,
    AuthModule,
    PublicModule,
    CustomItemsModule,
  ],
})
export class AppModule {}
