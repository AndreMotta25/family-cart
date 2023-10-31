import { Column, Entity, ManyToOne } from 'typeorm';

import { Entity as Parent } from '@modules/shared/entities/Entity';
import { User } from '@modules/users/entities/User';

import { Notification } from './Notification';

@Entity('Notifications_User')
class NotificationUser extends Parent {
  @ManyToOne(() => Notification)
  notification: Notification;

  @ManyToOne(() => User)
  emitter: User;

  @Column()
  emitterId: string;

  @ManyToOne(() => User)
  receptor: User;

  @Column()
  receptorId: string;
}

export { NotificationUser };
