// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Column, Entity, JoinTable, ManyToMany, OneToMany } from 'typeorm';

import { SharedList } from '@modules/list/entities/SharedList';

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

  @Column({ nullable: false, default: 'internal' })
  login: string;

  @Column({ generated: 'uuid' })
  hash: string;

  @OneToMany(() => FamilyMember, (u) => u.user)
  friends: FamilyMember[];

  @OneToMany(() => SharedList, (s) => s.owner)
  sharedList: SharedList[];

  @OneToMany(() => SharedList, (s) => s.additionalUser)
  sharedListInverse: SharedList[];

  constructor() {
    super();
  }
}

export { User };

/*
  Um usuario pode ter n listas compartilhadas
  por isso que aponta para owner
*/
