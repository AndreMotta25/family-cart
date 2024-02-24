import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { DeniedInviteUseCase } from './DeniedInviteUseCase';

class DeniedInviteController {
  async handle(request: Request, response: Response) {
    const { id } = request.user;
    const { notification_id } = request.query;
    const { owner_id } = request.params;

    const deniedInviteUseCase = container.resolve(DeniedInviteUseCase);
    await deniedInviteUseCase.execute({
      guest_id: id,
      owner_id: owner_id as string,
      notification_id: notification_id as string,
    });

    return response.status(204).json();
  }
}

export { DeniedInviteController };
