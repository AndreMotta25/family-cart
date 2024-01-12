import { INotificationsGrouped, IResponse } from '../GetNotificationsUseCase';

interface IGetNotification {
  getNotifications(
    objectNotification: INotificationsGrouped,
  ): Promise<IResponse[]>;
}

export { IGetNotification };
