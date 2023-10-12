import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { ShareListUseCase } from './ShareListUseCase';

class ShareListController {
  async handle(request: Request, response: Response) {
    const { id } = request.user;
    const { guest } = request.body;
    const { list } = request.params;

    const shareListUseCase = container.resolve(ShareListUseCase);

    const pending = await shareListUseCase.execute({
      ownerId: id,
      guestId: guest,
      listId: list,
    });

    return response.status(201).json(pending);
  }
}

export { ShareListController };
