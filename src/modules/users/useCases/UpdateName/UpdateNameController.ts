import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { UpdateNameUseCase } from './UpdateNameUseCase';

class UpdateNameController {
  async handle(request: Request, response: Response) {
    const { id } = request.user;
    const { name } = request.body;

    const updateNameUseCase = container.resolve(UpdateNameUseCase);

    await updateNameUseCase.execute({ id, name });

    return response.status(204).json();
  }
}

export { UpdateNameController };
