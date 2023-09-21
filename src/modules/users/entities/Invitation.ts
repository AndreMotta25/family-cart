import { Column, Entity, ManyToOne } from 'typeorm';

import { Entity as Parent } from '../../shared/entities/Entity';
import { User } from './User';

// tabela pivo
@Entity('Invitation')
class Invitation extends Parent {
  @ManyToOne(() => User)
  user: User;

  @Column({ nullable: false })
  userId: string;

  @Column({ nullable: false })
  userPendingId: string;

  @ManyToOne(() => User)
  user_pending: User;

  constructor() {
    super();
  }
}

export { Invitation };
