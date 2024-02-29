import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { AddItemUseCase } from './AddItemUseCase';

class AddItemController {
  async handle(request: Request, response: Response) {
    const { list_id } = request.params;
    const { name, quantity, link } = request.body;
    const { id } = request.user;

    const addItemUseCase = container.resolve(AddItemUseCase);

    const item_id = await addItemUseCase.execute({
      list_id,
      name,
      quantity: quantity || 0,
      url: link,
      user_logged_id: id,
    });

    return response.status(200).json(item_id);
  }
}

export { AddItemController };
