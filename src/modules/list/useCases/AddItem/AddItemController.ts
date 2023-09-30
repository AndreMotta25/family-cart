import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { AddItemUseCase } from './AddItemUseCase';

class AddItemController {
  async handle(request: Request, response: Response) {
    const { list_id } = request.params;
    const { name, quantity } = request.body;

    const addItemUseCase = container.resolve(AddItemUseCase);
    await addItemUseCase.execute({ list_id, name, quantity });

    return response.status(200).json();
  }
}

export { AddItemController };
