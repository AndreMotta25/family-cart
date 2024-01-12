import { List } from '@modules/list/entities/List';

import { INotificationResponse } from '../repositories/implements/NotificationRepository';
import { IResponse } from '../useCases/GetNotifications/GetNotificationsUseCase';

// Template
export const listsNotifications = {
  addItem(notification: INotificationResponse, list: List): IResponse {
    const { emitter, receptor } = notification;
    return {
      type: 'warning',
      entity_type: 'list',
      entity_id: list.id,
      message: `O usuario ${emitter.name} adicionou um novo item a lista ${list.name}`,
      notification_id: notification.id,
      created_at: notification.created_at,
      emitter: {
        id: emitter.id,
        name: emitter.name,
        email: emitter.email,
        avatar: '',
      },
      to: {
        id: receptor.id,
        name: receptor.name,
        email: receptor.email,
        avatar: '',
      },
      action: {
        accept: `${process.env.HOSTLINK}/notifications/${notification.id}/read`,
        reject: ``,
      },
      isRead: notification.read,
    };
  },
  shareList(notification: INotificationResponse, list: List) {
    const { emitter, receptor } = notification;

    return {
      type: 'action',
      entity_type: 'list',
      entity_id: list.id,
      message: `O usuario ${emitter.name} Está compartilhando a lista ${list.name} com você. Aceita ?`,
      notification_id: notification.id,
      created_at: notification.created_at,
      emitter: {
        id: emitter.id,
        name: emitter.name,
        email: emitter.email,
        avatar: '',
      },
      to: {
        id: receptor.id,
        name: receptor.name,
        email: receptor.email,
        avatar: '',
      },
      action: {
        accept: `${process.env.HOSTLINK}/list/${list.id}/accept_share`,
        reject: `${process.env.HOSTLINK}/list/${list.id}/denied_share`,
      },
      isRead: notification.read,
    };
  },
  acceptShare(notification: INotificationResponse, list: List) {
    const { emitter, receptor } = notification;

    return {
      type: 'warning',
      entity_type: 'list',
      entity_id: list.id,
      message: `O usuario ${emitter.name} aceitou o compartilhamento da lista ${list.name}.`,
      notification_id: notification.id,
      created_at: notification.created_at,
      emitter: {
        id: emitter.id,
        name: emitter.name,
        email: emitter.email,
        avatar: '',
      },
      to: {
        id: receptor.id,
        name: receptor.name,
        email: receptor.email,
        avatar: '',
      },
      action: {
        accept: `${process.env.HOSTLINK}/notifications/${notification.id}/read`,
        reject: '',
      },
      isRead: notification.read,
    };
  },
  removeItem(notification: INotificationResponse, list: List) {
    const { emitter, receptor } = notification;

    return {
      type: 'warning',
      entity_type: 'list',
      entity_id: list.id,
      message: `O usuario ${emitter.name} excluiu um item da lista ${list.name}.`,
      notification_id: notification.id,
      created_at: notification.created_at,
      emitter: {
        id: emitter.id,
        name: emitter.name,
        email: emitter.email,
        avatar: '',
      },
      to: {
        id: receptor.id,
        name: receptor.name,
        email: receptor.email,
        avatar: '',
      },
      action: {
        accept: `${process.env.HOSTLINK}/notifications/${notification.id}/read`,
        reject: '',
      },
      isRead: notification.read,
    };
  },
};
