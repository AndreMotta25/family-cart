import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { UpdateReadStatusUseCase } from './UpdateReadStatusUseCase';

class UpdateReadStatusController {
  async handle(request: Request, response: Response) {
    const { notification_id } = request.params;
    const { id } = request.user;

    const updateNotificatonUseCase = container.resolve(UpdateReadStatusUseCase);

    await updateNotificatonUseCase.execute({
      notification_id,
      receptor_id: id,
    });

    return response.status(200).json();
  }
}

export { UpdateReadStatusController };
