import { inject, injectable } from 'tsyringe';

import { List } from '../../../../../list/entities/List';
import { IListRepository } from '../../../../../list/repositories/IListRepository';
import { listsNotifications } from '../../../../notifications_templates/listTemplates';
import {
  INotificationsGrouped,
  IResponse,
} from '../../GetNotificationsUseCase';
import { IGetNotification } from '../IGetNotification';

@injectable()
class ListNotificationProvider implements IGetNotification {
  constructor(
    @inject('ListRepository')
    private listRepository: IListRepository,
  ) {}

  async getNotifications(
    objectNotification: INotificationsGrouped,
  ): Promise<IResponse[]> {
    const list = (await this.listRepository.findListById(
      objectNotification.entity_id,
    )) as List;

    return objectNotification.notifications.map((notification) => {
      const type = notification.type as
        | 'addItem'
        | 'shareList'
        | 'acceptShare'
        | 'removeItem';
      return listsNotifications[type](notification, list);
    });
  }
}

export { ListNotificationProvider };
