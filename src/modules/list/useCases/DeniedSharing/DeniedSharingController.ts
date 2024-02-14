import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { DeniedSharingUseCase } from './DeniedSharingUseCase';

class DeniedSharingController {
  async handle(request: Request, response: Response) {
    const { owner_id, notification_id } = request.query;
    const { list_id } = request.params;
    const { id } = request.user;

    const deniedSharingUseCase = container.resolve(DeniedSharingUseCase);

    await deniedSharingUseCase.execute({
      owner_id: owner_id as string,
      list_id,
      guest_id: id,
      notification_id: notification_id as string,
    });

    return response.status(200).json();
  }
}

export { DeniedSharingController };
