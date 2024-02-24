import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { UpdatePasswordUseCase } from './UpdatePasswordUseCase';

class UpdatePasswordController {
  async handle(request: Request, response: Response) {
    const { id } = request.user;
    const { new_password } = request.body;
    const updatePasswordUseCase = container.resolve(UpdatePasswordUseCase);

    await updatePasswordUseCase.execute({ id, new_password });

    return response.status(204).json();
  }
}

export { UpdatePasswordController };
