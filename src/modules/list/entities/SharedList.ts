import { Column, CreateDateColumn, Entity, ManyToOne } from 'typeorm';

import { Entity as Parent } from '@modules/shared/entities/Entity';
import { User } from '@modules/users/entities/User';

import { List } from './List';

@Entity('SharedList')
class SharedList extends Parent {
  @ManyToOne(() => List, (l) => l.aditionalUsers, { onDelete: 'CASCADE' })
  list: List;

  @Column()
  listId: string;

  @ManyToOne(() => User, (u) => u.sharedListInverse)
  owner: User;

  @Column()
  ownerId: string;

  @ManyToOne(() => User, (u) => u.sharedList)
  additionalUser: User;

  @Column()
  additionalUserId: string;

  @CreateDateColumn()
  createdAt: Date;
}

export { SharedList };
