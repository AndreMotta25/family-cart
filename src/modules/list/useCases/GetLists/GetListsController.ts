import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { GetListsUseCase } from './GetListsUseCase';

class GetListsController {
  async handle(request: Request, response: Response) {
    const { id } = request.user;
    const getListsUseCase = container.resolve(GetListsUseCase);

    const lists = await getListsUseCase.execute(id);

    return response.status(200).json(lists);
  }
}

export { GetListsController };
