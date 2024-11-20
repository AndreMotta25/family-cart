/* eslint-disable no-use-before-define */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Column, Entity, JoinTable, ManyToMany, OneToMany } from 'typeorm';

import { SharedList } from '../../list/entities/SharedList';
import { Entity as Parent } from '../../shared/entities/Entity';
// import { FamilyMember } from './FamilyMember';

@Entity('Users')
class User extends Parent {
  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  avatar: string;

  @Column({ nullable: true })
  cid: string;

  @Column({ nullable: false, default: 'internal' })
  login: string;

  @Column({ generated: 'uuid' })
  hash: string;

  // @OneToMany(() => FamilyMember, (u) => u.user)
  @ManyToMany(() => User)
  @JoinTable({
    name: 'UsersFriends', // nome da tabela de relacionamento
    joinColumn: {
      name: 'user_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'friend_id',
      referencedColumnName: 'id',
    },
  })
  friends: User[];

  // Um usuário pode ser dono de muitas listas compartilhadas == Pode compartilhar varias listas
  // aqui vamos identificar o dono da lista compartilhada.
  // listas que o usuario compartilhou.
  @OneToMany(() => SharedList, (s) => s.owner)
  sharedList: SharedList[];

  // Um usuário pode ser adicionado a muitas listas compartilhadas.
  // Listas compartilhadas com o usuario.
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

  O usuario pode ter n listas compartilhadas com ele. por isso que aponta para additionalUser

  O relacionamento é de muitos para muitos, mas como colocamos propriedades extras em sharedList, tivermos ]
  que fazer esse conexão bi-direcional.  
*/
