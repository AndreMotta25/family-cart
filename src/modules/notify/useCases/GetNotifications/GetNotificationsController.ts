import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { GetNotificationsUseCase } from './GetNotificationsUseCase';

class GetNotificationsController {
  async handle(request: Request, response: Response) {
    const { id } = request.user;
    const getNotifications = container.resolve(GetNotificationsUseCase);

    const notifications = await getNotifications.execute(id);

    return response.status(200).json(notifications);
  }
}

export { GetNotificationsController };
