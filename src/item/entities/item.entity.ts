import { Category } from 'src/category/entities/category.entity';
import { List } from 'src/list/entities/list.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

@Entity()
export class Item {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  name: string;
  @Column({ default: 'private' })
  state: 'private' | 'public';
  @Column({ default: 1 })
  quantity: number;
  @Column({ default: false })
  done: boolean;
  @ManyToOne(() => List, (list) => list.items, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  list: List;
  @Column({ nullable: true })
  listId: number;
  @ManyToOne(() => Category, (category) => category.items)
  category: Category;
  @Column()
  categoryId: number;
  @Column({ nullable: true })
  userId: number;
}
