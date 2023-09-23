import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { AcceptInviteUseCase } from './AcceptInviteUseCase';

class AcceptInviteController {
  async handle(request: Request, response: Response) {
    const { id } = request.user;
    const { owner } = request.body;

    const acceptInviteUseCase = container.resolve(AcceptInviteUseCase);

    await acceptInviteUseCase.execute({
      user_id: id,
      invitationOwnerId: owner,
    });

    return response.status(204).json();
  }
}

export { AcceptInviteController };
