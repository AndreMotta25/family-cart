import { Column, CreateDateColumn, Entity, ManyToOne } from 'typeorm';

import { Entity as Parent } from '../../shared/entities/Entity';
import { User } from '../../users/entities/User';
import { List } from './List';

@Entity('PendingList')
class PendingList extends Parent {
  @ManyToOne(() => User)
  guest: User;

  @Column()
  guestId: string;

  @ManyToOne(() => User)
  owner: User;

  @Column()
  ownerId: string;

  @ManyToOne(() => List, { onDelete: 'CASCADE' })
  list: List;

  @Column()
  listId: string;

  @CreateDateColumn()
  createdAt: Date;
}

export { PendingList };
