import { Repository } from 'typeorm';
import { v4 } from 'uuid';

import { Notification } from '@modules/notify/entities/Notification';
import { NotificationUser } from '@modules/notify/entities/NotificationUser';
import { User } from '@modules/users/entities/User';

import { database } from '../../../../database/index';
import {
  INotificationRepository,
  INotificationRequest,
  IUpdateNotification,
} from '../INotificationRepository';

export interface INotificationResponse {
  id: string;
  read: boolean;
  type: string;
  entity_id: string;
  entity_name: string;
  created_at: Date;
  emitter: User;
  receptor: User;
}

class NotificationRepository implements INotificationRepository {
  private repository: Repository<Notification>;
  private repositoryNotificationsUser: Repository<NotificationUser>;

  constructor() {
    this.repository = database.getRepository(Notification);
    this.repositoryNotificationsUser = database.getRepository(NotificationUser);
  }
  async removeNotificationById(notification_id: string): Promise<void> {
    await this.repository.delete({ id: notification_id });
  }
  async updateNotification({
    notification,
  }: IUpdateNotification): Promise<void> {
    await this.repository.save({ ...notification });
  }
  async totalOfNotifications(user_id: string): Promise<number> {
    const total = await this.repositoryNotificationsUser.count({
      where: {
        receptorId: user_id,
        notification: {
          read: false,
        },
      },
    });
    return total;
  }

  async deleteNotificationByInvitation(invitation_id: string): Promise<void> {
    await this.repository.delete({ entity_id: invitation_id });
  }

  async getByReceptor(to: string): Promise<INotificationResponse[]> {
    const notificationsUser = await this.repositoryNotificationsUser.find({
      where: {
        receptorId: to,
      },
      relations: { emitter: true, receptor: true, notification: true },
      order: { notification: { created_at: 'desc' } },
    });

    const notifications = notificationsUser.map(
      (ntu): INotificationResponse => ({
        id: ntu.notification.id,
        type: ntu.notification.type,
        created_at: ntu.notification.created_at,
        emitter: ntu.emitter,
        entity_id: ntu.notification.entity_id,
        entity_name: ntu.notification.entity_name,
        read: ntu.notification.read,
        receptor: ntu.receptor,
      }),
    );

    return notifications;
  }

  async create(data: INotificationRequest, receptors: string[]): Promise<void> {
    const notification = this.repository.create({
      entity_name: data.entity_name,
      entity_id: data.entity_id,
      type: data.type,
      read: data.read,
    });

    await this.repository.save(notification);
    // Dessa forma posso colocar todos os dados numa unica ida ao banco de dados.
    await database
      .createQueryBuilder()
      .insert()
      .into(NotificationUser)
      .values(
        receptors.map((r) => ({
          // Como não estamos construindo o objeto antes de colocar no banco, temos que passar o id manualmente.
          id: v4(),
          notification,
          receptorId: r,
          emitterId: data.emitterId,
        })),
      )
      .execute();
  }

  async getNotificationById(
    notification_id: string,
  ): Promise<NotificationUser | null> {
    const notification = this.repositoryNotificationsUser.findOne({
      where: { notificationId: notification_id },
      relations: { receptor: true, notification: true, emitter: true },
    });
    return notification;
  }
}

export { NotificationRepository };
