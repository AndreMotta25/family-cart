import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { RemoveListUseCase } from './RemoveListUseCase';

class RemoveListController {
  async handle(request: Request, response: Response) {
    const { id } = request.user;
    const { list_id } = request.params;

    const removeListUseCaSe = container.resolve(RemoveListUseCase);

    await removeListUseCaSe.execute({ owner_id: id, id_list: list_id });

    return response.status(204).json();
  }
}

export { RemoveListController };
