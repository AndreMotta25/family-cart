import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { AcceptInviteUseCase } from './AcceptInviteUseCase';

class AcceptInviteController {
  async handle(request: Request, response: Response) {
    const { id } = request.user;
    const { owner_id } = request.params;
    const { notification_id } = request.body;

    const acceptInviteUseCase = container.resolve(AcceptInviteUseCase);

    const message = await acceptInviteUseCase.execute({
      userLogged_id: id,
      invitationOwnerId: owner_id,
      notification_id,
    });

    return response.status(201).json(message);
  }
}

export { AcceptInviteController };
