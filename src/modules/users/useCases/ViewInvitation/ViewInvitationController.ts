import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { ViewInvitationUseCase } from './ViewInvitationUseCase';

class ViewInvitationController {
  async handle(request: Request, response: Response) {
    const { id } = request.user;
    const viewInvitationUseCase = container.resolve(ViewInvitationUseCase);

    const invites = await viewInvitationUseCase.execute(id);
    return response.status(200).json(invites);
  }
}

export { ViewInvitationController };
