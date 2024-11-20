import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  UpdateDateColumn,
} from 'typeorm';

import { Entity as Parent } from '../../shared/entities/Entity';
import { User } from '../../users/entities/User';
import { Item } from './Item';
import { SharedList } from './SharedList';

@Entity('Lists')
class List extends Parent {
  @ManyToOne(() => User) // Um usuario pode ter muitas listas.
  owner: User;

  // Essa propriedade só vai entrar aqui para podermos pesquisar.
  @Column({ nullable: false })
  ownerId: string;

  @Column()
  name: string;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  update_at: Date;

  // uma lista tem muitos itens
  @OneToMany(() => Item, (item) => item.list)
  itens: Item[];

  // uma lista pode ser compartilhada com varios usuarios.
  @OneToMany(() => SharedList, (s) => s.list, { onDelete: 'CASCADE' })
  aditionalUsers: SharedList[];

  constructor() {
    super();
  }
}

export { List };
