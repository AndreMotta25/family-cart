import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { CancelFriendshipUseCase } from './CancelFriendshipUseCase';

class CancelFriendshipController {
  async handle(request: Request, response: Response) {
    const { id } = request.user;
    const { remove_friendly_id } = request.body;

    const cancelFriendshipUseCase = container.resolve(CancelFriendshipUseCase);

    await cancelFriendshipUseCase.execute({
      id,
      id_friend: remove_friendly_id,
    });

    return response.status(204).json();
  }
}

export { CancelFriendshipController };
