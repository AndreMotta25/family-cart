import { List } from '../../list/entities/List';
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
        accept: `notifications/${notification.id}/read`,
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
      message: notification.read
        ? `Voce aceitou participar da lista ${list.name} do ${emitter.name}`
        : `O usuario <b>${emitter.name}</b>, Está compartilhando a lista <b>${list.name}<b/> com você. Aceita ?`,
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
        accept: `lists/${list.id}/accept_share`,
        reject: `lists/${list.id}/denied_share`,
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
      message: `O usuario <b>${emitter.name}</b> aceitou o compartilhamento da lista <b>${list.name}</b>.`,
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
        accept: `notifications/${notification.id}/read`,
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
        accept: `notifications/${notification.id}/read`,
        reject: '',
      },
      isRead: notification.read,
    };
  },
  cancelSharing(notification: INotificationResponse, list: List) {
    const { emitter, receptor } = notification;

    return {
      type: 'warning',
      entity_type: 'list',
      entity_id: list.id,
      message: `O usuario ${emitter.name} cancelou o compartilhamento da lista ${list.name}.`,
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
        accept: `notifications/${notification.id}/read`,
        reject: '',
      },
      isRead: notification.read,
    };
  },
};
