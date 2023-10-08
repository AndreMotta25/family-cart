import { Column, Entity, ManyToOne } from 'typeorm';

import { Entity as Parent } from '@modules/shared/entities/Entity';

import { List } from './List';

@Entity('Itens')
class Item extends Parent {
  @Column()
  name: string;

  @Column()
  quantity: number;

  // Quando deletar a lista, seus respectivos itens vão ser excluidos.
  @ManyToOne(() => List, { onDelete: 'CASCADE' })
  list: List;

  @Column({ nullable: true })
  url: string;

  constructor() {
    super();
  }
}

export { Item };
