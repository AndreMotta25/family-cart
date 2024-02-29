import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { IsSharedUseCase } from './IsSharedUseCase';

class IsSharedController {
  async handle(request: Request, response: Response) {
    const { list_id, friend_id } = request.params;

    const isSharedUseCase = container.resolve(IsSharedUseCase);
    const result = await isSharedUseCase.execute({
      friend_id,
      list_id,
    });

    return response.status(200).json(result);
  }
}

export { IsSharedController };
