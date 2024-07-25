import { inject, injectable } from 'tsyringe';

import { AppError } from '../../../../errors/AppError';
import { INotificationRepository } from '../../repositories/INotificationRepository';

interface IUpdateReadStatusRequest {
  notification_id: string;
  receptor_id: string;
}

@injectable()
class UpdateReadStatusUseCase {
  constructor(
    @inject('NotificationRepository')
    private notificationRepository: INotificationRepository,
  ) {}

  async execute({ notification_id, receptor_id }: IUpdateReadStatusRequest) {
    const notificationUser =
      await this.notificationRepository.getNotificationById(notification_id);

    if (!notificationUser) {
      throw new AppError({
        message: 'Notification Not Found',
        statusCode: 404,
      });
    }
    if (notificationUser.receptorId !== receptor_id) {
      throw new AppError({
        message: 'Only receptor can change a notification',
        statusCode: 400,
      });
    }
    notificationUser.notification.read = true;

    await this.notificationRepository.updateNotification({
      notification: notificationUser.notification,
    });
  }
}

export { UpdateReadStatusUseCase };
