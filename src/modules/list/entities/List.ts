import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  UpdateDateColumn,
} from 'typeorm';

import { Entity as Parent } from '@modules/shared/entities/Entity';
import { User } from '@modules/users/entities/User';

import { Item } from './Item';
import { SharedList } from './SharedList';

@Entity('Lists')
class List extends Parent {
  @ManyToOne(() => User)
  owner: User;

  @Column()
  name: string;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  update_at: Date;

  @OneToMany(() => Item, (item) => item.list)
  itens: Item[];

  @OneToMany(() => SharedList, (s) => s.list)
  aditionalUsers: SharedList[];

  constructor() {
    super();
  }
}

export { List };
