import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { GetSharedListsUseCase } from './GetSharedListsUseCase';

class GetSharedListsController {
  async handle(request: Request, response: Response) {
    const { id } = request.user;

    const getSharedListUseCase = container.resolve(GetSharedListsUseCase);

    const lists = await getSharedListUseCase.execute({ guest_id: id });

    return response.status(200).json(lists);
  }
}

export { GetSharedListsController };
