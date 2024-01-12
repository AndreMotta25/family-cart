import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { AcceptInviteUseCase } from './AcceptInviteUseCase';

class AcceptInviteController {
  async handle(request: Request, response: Response) {
    const { id } = request.user;
    const { owner_id } = request.params;

    const acceptInviteUseCase = container.resolve(AcceptInviteUseCase);

    await acceptInviteUseCase.execute({
      userLogged_id: id,
      invitationOwnerId: owner_id,
    });

    return response.status(204).json();
  }
}

export { AcceptInviteController };
