import { Notification } from '../entities/Notification';
import { NotificationUser } from '../entities/NotificationUser';
import { INotificationResponse } from './implements/NotificationRepository';

export interface INotificationRequest {
  emitterId: string;
  read: boolean;
  type: string;
  entity_id: string;
  entity_name: string;
}
export interface IUpdateNotification {
  notification: Notification;
}

interface INotificationRepository {
  create(data: INotificationRequest, receptors: string[]): Promise<void>;
  updateNotification({ notification }: IUpdateNotification): Promise<void>;
  getByReceptor(to: string): Promise<INotificationResponse[]>;
  deleteNotificationByInvitation(invitation_id: string): Promise<void>;
  totalOfNotifications(user_id: string): Promise<number>;
  getNotificationById(
    notification_id: string,
  ): Promise<NotificationUser | null>;
  removeNotificationById(notification_id: string): Promise<void>;
}
export { INotificationRepository };
