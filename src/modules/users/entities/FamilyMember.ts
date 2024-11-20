/* eslint-disable @typescript-eslint/no-unused-vars */
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { Entity as Parent } from '../../shared/entities/Entity';
import { User } from './User';

// @Entity('FamilyMembers')
class FamilyMember extends Parent {
  @ManyToOne(() => User)
  user: User;

  @ManyToOne(() => User)
  kin: User;

  @Column()
  userId: string;

  @Column()
  kinId: string;

  constructor() {
    super();
  }
}

export { FamilyMember };
