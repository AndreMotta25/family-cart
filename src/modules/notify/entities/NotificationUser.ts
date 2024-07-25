import { Column, Entity, ManyToOne } from 'typeorm';

import { Entity as Parent } from '../../shared/entities/Entity';
import { User } from '../../users/entities/User';
import { Notification } from './Notification';

@Entity('Notifications_User')
class NotificationUser extends Parent {
  @ManyToOne(() => Notification, { onDelete: 'CASCADE' })
  notification: Notification;

  @Column()
  notificationId: string;

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

/*
  O relacionamento de user e notifications é de muitos para muitos, o que gerá uma tabela pivo. Do ponto de vista da tabela pivo, 
  o relacionamento dela com as demais é de 1 para muitos.
*/
