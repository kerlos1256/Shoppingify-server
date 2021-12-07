import { Category } from 'src/category/entities/category.entity';
import { CustomItem } from 'src/custom-items/entities/custom-item.entity';
import { List } from 'src/list/entities/list.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ unique: true })
  username: string;
  @Column({ default: 'user' })
  role: 'user' | 'admin';
  @Column()
  password: string;
  @OneToMany(() => List, (list) => list.owner)
  lists: List[];
  @OneToMany(() => Category, (category) => category.owner)
  categories: Category[];
  @OneToMany(() => CustomItem, (item) => item.owner)
  customItems: CustomItem[];
}
