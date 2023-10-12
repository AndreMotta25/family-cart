import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { AcceptSharingUseCase } from './AcceptSharingUseCase';

class AcceptSharingController {
  async handle(request: Request, response: Response) {
    const { id } = request.user;
    const { owner } = request.body;
    const { list_id } = request.params;

    const acceptList = container.resolve(AcceptSharingUseCase);

    const acceptResponse = await acceptList.execute({
      ownerId: owner,
      guestId: id,
      listId: list_id,
    });

    return response.status(200).json(acceptResponse);
  }
}

export { AcceptSharingController };
