import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Category } from '../../category/entities/category.entity';

@Entity()
export class CustomItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToOne(() => Category, (cate) => cate.customItems)
  category: Category;

  @Column()
  categoryId: number;

  @ManyToOne(() => User, (user) => user.customItems)
  owner: User;

  @Column()
  ownerId: number;
}
