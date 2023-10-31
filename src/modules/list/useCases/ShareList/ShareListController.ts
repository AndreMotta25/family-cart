import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { ShareListUseCase } from './ShareListUseCase';

class ShareListController {
  async handle(request: Request, response: Response) {
    const { id } = request.user;
    const { friend } = request.body;
    const { list_id } = request.params;

    const shareListUseCase = container.resolve(ShareListUseCase);

    const pending = await shareListUseCase.execute({
      ownerId: id,
      guestId: friend,
      listId: list_id,
    });

    return response.status(201).json(pending);
  }
}

export { ShareListController };
