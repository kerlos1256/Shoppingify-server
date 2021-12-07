import { Item } from 'src/item/entities/item.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';

@Entity()
export class List {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  status: 'active' | 'completed' | 'canceled';
  @ManyToOne(() => User, (user) => user.lists, { onDelete: 'CASCADE' })
  owner: User;
  @Column()
  ownerId: number;
  @Column()
  listName: string;
  @OneToMany(() => Item, (item) => item.list)
  items: Item[];
}
