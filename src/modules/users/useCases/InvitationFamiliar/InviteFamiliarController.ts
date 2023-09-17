import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { InviteFamiliarUseCase } from './InviteFamiliarUseCase';

class InviteFamiliarController {
  async handle(request: Request, response: Response) {
    const { id } = request.user;
    const { kin_email } = request.body;

    const inviteFamiliarUseCase = container.resolve(InviteFamiliarUseCase);

    await inviteFamiliarUseCase.execute({ kin_email, user_id: id });

    return response.status(201).json();
  }
}

export { InviteFamiliarController };
