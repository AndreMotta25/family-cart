import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { RenameListUseCase } from './RenameListUseCase';

class RenameListController {
  async handle(request: Request, response: Response) {
    const { new_name } = request.body;
    const { list_id } = request.params;
    const { id } = request.user;

    const renameListUseCase = container.resolve(RenameListUseCase);

    await renameListUseCase.execute({ new_name, list_id, owner_id: id });

    return response.status(204).json();
  }
}

export { RenameListController };
