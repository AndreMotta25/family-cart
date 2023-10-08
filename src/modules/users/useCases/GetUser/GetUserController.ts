import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { GetUserUseCase } from './GetUserUseCase';

class GetUserController {
  async handle(request: Request, response: Response) {
    const { id } = request.user;
    const getUserUseCase = container.resolve(GetUserUseCase);

    const user = await getUserUseCase.execute(id);
    return response.status(200).json(user);
  }
}

export { GetUserController };
