import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import { Category } from './category/entities/category.entity';
import { CustomItem } from './custom-items/entities/custom-item.entity';
import { Item } from './item/entities/item.entity';
import { List } from './list/entities/list.entity';
import { User } from './user/entities/user.entity';

export const config: PostgresConnectionOptions = {
  type: 'postgres',
  port: 5432,
  database: 'shoppingify',
  username: 'postgres',
  password: '123456',
  synchronize: true,
  entities: [User, List, Item, Category, CustomItem],
};
