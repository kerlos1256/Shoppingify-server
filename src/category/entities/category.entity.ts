import { CustomItem } from 'src/custom-items/entities/custom-item.entity';
import { Item } from 'src/item/entities/item.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  name: string;
  @Column({ default: 'private' })
  state: 'public' | 'private';
  @OneToMany(() => Item, (item) => item.category)
  items: Item[];
  @ManyToOne(() => User, (user) => user.categories, { nullable: true })
  owner: User;
  @Column({ nullable: true })
  ownerId: number;
  @OneToMany(() => CustomItem, (item) => item.category)
  customItems: CustomItem[];
}
