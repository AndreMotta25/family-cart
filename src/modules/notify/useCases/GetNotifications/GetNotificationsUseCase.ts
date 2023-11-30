/* eslint-disable @typescript-eslint/no-explicit-any */
import { inject, injectable } from 'tsyringe';

import { List } from '@modules/list/entities/List';
import { IListRepository } from '@modules/list/repositories/IListRepository';
import { listsNotifications } from '@modules/notify/notifications_templates/listTemplates';
import { INotificationResponse } from '@modules/notify/repositories/implements/NotificationRepository';
import { INotificationRepository } from '@modules/notify/repositories/INotificationRepository';

interface IRepositories {
  list: IListRepository;
}

interface INotificationsNormalized {
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
  private repositories: IRepositories;
  /*
    Passando os repositorios pelo construtor vou evitar criar repositorios desnecessariamente, por que são singleton.
    */
  constructor(
    @inject('NotificationRepository')
    private notifyRepository: INotificationRepository,
    @inject('ListRepository')
    private listRepository: IListRepository,
  ) {
    this.repositories = {
      list: this.listRepository,
    };
  }
  async execute(to: string) {
    const normalizedNotifications: INotificationsNormalized[] = [];
    const notifications = await this.notifyRepository.getByReceptor(to);

    console.log(notifications);

    // Empilha de acordo com o id da entidade em questão.
    for (let index = 0; index < notifications.length; index += 1) {
      const noti = normalizedNotifications.find(
        (n) => n.name === notifications[index].entity_name,
      );
      if (noti) {
        noti.notifications = [...noti.notifications, notifications[index]];
      } else {
        normalizedNotifications.push({
          name: notifications[index].entity_name,
          notifications: [notifications[index]],
          entity_id: notifications[index].entity_id,
        });
      }
    }
    // pega as informaçoes.
    const notificationsFiltered = (
      await Promise.all(
        normalizedNotifications.map(async (objectNotification) => {
          if (objectNotification.name === 'list') {
            const list = (await this.repositories.list.findListById(
              objectNotification.entity_id,
            )) as List;

            return objectNotification.notifications.map((notification) => {
              const type = notification.type as 'addItem' | 'shareList';
              return listsNotifications[type](notification, list);
            });
          }
          return false;
        }),
      )
    ).filter((e) => e);

    return notificationsFiltered[0];
  }
}

export { GetNotificationsUseCase };
export { IResponse };
