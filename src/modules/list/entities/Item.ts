import { Column, Entity, ManyToOne } from 'typeorm';

import { Entity as Parent } from '@modules/shared/entities/Entity';

import { List } from './List';

@Entity('Itens')
class Item extends Parent {
  @Column()
  name: string;

  @Column()
  quantity: number;

  @ManyToOne(() => List)
  list: List;

  constructor() {
    super();
  }
}

export { Item };
