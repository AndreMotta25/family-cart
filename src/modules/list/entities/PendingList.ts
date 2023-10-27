import { Column, CreateDateColumn, Entity, ManyToOne } from 'typeorm';

import { Entity as Parent } from '@modules/shared/entities/Entity';
import { User } from '@modules/users/entities/User';

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

  @ManyToOne(() => List)
  list: List;

  @Column()
  listId: string;

  @CreateDateColumn()
  createdAt: Date;
}

export { PendingList };
