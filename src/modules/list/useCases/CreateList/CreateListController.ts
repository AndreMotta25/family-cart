import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { CreateListUseCase } from './CreateListUseCase';

class CreateListController {
  async handle(request: Request, response: Response) {
    const { id } = request.user;
    const { name } = request.body;

    const createListUseCase = container.resolve(CreateListUseCase);
    const list = await createListUseCase.execute({ name, owner_id: id });

    return response.status(200).json(list);
  }
}

export { CreateListController };
