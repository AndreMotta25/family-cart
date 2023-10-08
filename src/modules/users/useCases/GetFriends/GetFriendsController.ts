import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { GetFriendsUseCase } from './GetFriendsUseCase';

class GetFriendsController {
  async handle(request: Request, response: Response) {
    const { id } = request.user;
    const getFriendsUseCase = container.resolve(GetFriendsUseCase);

    const friends = await getFriendsUseCase.execute(id);
    return response.status(200).json(friends);
  }
}

export { GetFriendsController };
