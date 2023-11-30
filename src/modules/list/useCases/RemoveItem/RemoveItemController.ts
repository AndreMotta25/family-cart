import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { RemoveItemUseCase } from './RemoveItemUseCase';

class RemoveItemController {
  async handle(request: Request, response: Response) {
    const { list_id, id_item } = request.params;
    const removeItemUseCase = container.resolve(RemoveItemUseCase);

    await removeItemUseCase.execute({ item_id: id_item, list_id });

    return response.status(204).json();
  }
}

export { RemoveItemController };
