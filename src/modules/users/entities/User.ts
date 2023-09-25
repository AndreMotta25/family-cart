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

  @ManyToMany(() => User)
  @JoinTable({
    name: 'FamilyMembers',
    joinColumn: {
      name: 'userId',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'kinId',
      referencedColumnName: 'id',
    },
  })
  // eslint-disable-next-line no-use-before-define
  familyMembers: User[];

  // @ManyToMany(() => User, (u) => u.familyMembers)
  // friends: User[];
  @OneToMany(() => FamilyMember, (u) => u.user)
  friends: FamilyMember[];

  constructor() {
    super();
  }
}

export { User };
