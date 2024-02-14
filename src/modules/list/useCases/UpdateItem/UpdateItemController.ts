import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { UpdateItemUseCase } from './UpdateItemUseCase';

class UpdateItemController {
  async handle(request: Request, response: Response) {
    const { id } = request.user;
    const { list_id, item_id } = request.params;
    const { name, link } = request.body;

    const updateUseCase = container.resolve(UpdateItemUseCase);
    await updateUseCase.execute({
      list_id,
      user_id: id,
      item_id,
      name,
      url: link,
    });

    return response.status(200).json();
  }
}

export { UpdateItemController };
