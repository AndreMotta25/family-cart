import { Column, Entity, JoinTable, ManyToMany } from 'typeorm';

import { Entity as Parent } from '../../shared/entities/Entity';

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
      name: 'user',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'kin',
      referencedColumnName: 'id',
    },
  })
  // eslint-disable-next-line no-use-before-define
  familyMembers: User[];

  constructor() {
    super();
  }
}

export { User };
