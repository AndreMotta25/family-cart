import { Column, Entity, ManyToOne } from 'typeorm';

import { Entity as Parent } from '../../shared/entities/Entity';
import { User } from './User';

// tabela pivo
@Entity('PendingFamiliar')
class PendingFamiliar extends Parent {
  @ManyToOne(() => User)
  user: User;

  @Column({ nullable: false })
  userId: string;

  @ManyToOne(() => User)
  user_pending: User;

  constructor() {
    super();
  }
}

export { PendingFamiliar };
