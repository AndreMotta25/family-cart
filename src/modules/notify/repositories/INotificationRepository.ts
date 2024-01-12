import { INotificationResponse } from './implements/NotificationRepository';

export interface INotificationRequest {
  emitterId: string;
  read: boolean;
  type: string;
  entity_id: string;
  entity_name: string;
}

interface INotificationRepository {
  create(data: INotificationRequest, receptors: string[]): Promise<void>;
  getByReceptor(to: string): Promise<INotificationResponse[]>;
  deleteNotificationByInvitation(invitation_id: string): Promise<void>;
  totalOfNotifications(user_id: string): Promise<number>;
}
export { INotificationRepository };
