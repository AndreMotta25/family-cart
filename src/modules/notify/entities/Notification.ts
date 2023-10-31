import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  // JoinTable,
  // ManyToMany,
} from 'typeorm';

import { Entity as Parent } from '@modules/shared/entities/Entity';

import { NotificationUser } from './NotificationUser';
// import { User } from '@modules/users/entities/User';

@Entity('Notifications')
class Notification extends Parent {
  @Column({ default: false })
  read: boolean;

  @OneToMany(() => NotificationUser, (nt) => nt.notification, { cascade: true })
  notifications: NotificationUser[];

  @Column()
  type: string;

  @Column()
  entity_id: string;

  @Column()
  entity_name: string;

  @CreateDateColumn()
  created_at: Date;

  constructor() {
    super();
    this.read = false;
  }
}

export { Notification };

/*
    Um objeto de notificação, pode estar em n notificaçoes(porque pode ser para mais de um receptor.)
*/
