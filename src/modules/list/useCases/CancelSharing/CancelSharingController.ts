import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { CancelSharingUseCase } from './CancelSharingUseCase';

class CancelSharingController {
  async handle(request: Request, response: Response) {
    const { list_id, guest_id } = request.params;
    const { id } = request.user;

    const cancelUseCase = container.resolve(CancelSharingUseCase);

    await cancelUseCase.execute({ guest_id, list_id, owner_id: id });

    return response.status(200).json();
  }
}

export { CancelSharingController };
