/* eslint-disable @typescript-eslint/no-explicit-any */
import { inject, injectable } from 'tsyringe';

import { INotificationResponse } from '../../repositories/implements/NotificationRepository';
import { INotificationRepository } from '../../repositories/INotificationRepository';
import { providers } from './OCP/Entities';
import { IGetNotification } from './OCP/IGetNotification';

export interface INotificationsGrouped {
  name: string;
  notifications: INotificationResponse[];
  entity_id: string;
}
interface IResponse {
  type: string;
  entity_type: string;
  entity_id: string;
  message: string;
  notification_id: string;
  created_at: Date;
  emitter: {
    id: string;
    name: string;
    email: string;
    avatar: string;
  };
  to: {
    id: string;
    name: string;
    email: string;
    avatar: string;
  };
  action: {
    accept: string;
    reject: string;
  };
  isRead: boolean;
}

@injectable()
class GetNotificationsUseCase {
  constructor(
    @inject('NotificationRepository')
    private notifyRepository: INotificationRepository,
  ) {}

  async execute(to: string) {
    const notifications = await this.notifyRepository.getByReceptor(to);
    const groupedNotifications = this.groupNotifications(notifications);

    const notificationsFiltered = (
      await Promise.all(
        groupedNotifications.map(async (objectNotification) => {
          const notificationProvider: IGetNotification =
            providers[objectNotification.name as keyof typeof providers]();

          return notificationProvider.getNotifications(objectNotification);
        }),
      )
    ).reduce((acc: IResponse[], next: IResponse[]) => {
      return acc.concat(next);
    }, []);

    return notificationsFiltered || [];
  }
  private groupNotifications(notifications: INotificationResponse[]) {
    // os returns atualizam o estado do acumulador
    const groupedNotifications = notifications.reduce(
      (
        notificationGroup: INotificationsGrouped[],
        notification: INotificationResponse,
      ) => {
        const group = notificationGroup.find(
          (n) =>
            n.name === notification.entity_name &&
            n.entity_id === notification.id,
        );
        if (group) {
          group.notifications = [...group.notifications, notification];
          return [...notificationGroup];
        }
        return [
          ...notificationGroup,
          {
            name: notification.entity_name,
            notifications: [notification],
            entity_id: notification.entity_id,
          },
        ];
      },
      [],
    );

    return groupedNotifications;
  }
}

export { GetNotificationsUseCase };
export { IResponse };

/*
  A aplicação do ocp aqui foi interessante porque cada parte da notificação fica isolada se uma der problema não afetará a outra parte
  e acresentar mais tipos de notificaçoes fica mais facil.
*/
