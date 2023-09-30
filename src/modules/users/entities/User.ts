// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Column, Entity, JoinTable, ManyToMany, OneToMany } from 'typeorm';

import { Entity as Parent } from '../../shared/entities/Entity';
import { FamilyMember } from './FamilyMember';

@Entity('Users')
class User extends Parent {
  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @OneToMany(() => FamilyMember, (u) => u.user)
  friends: FamilyMember[];

  constructor() {
    super();
  }
}

export { User };
