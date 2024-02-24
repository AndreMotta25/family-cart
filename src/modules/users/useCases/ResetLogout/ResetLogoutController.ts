import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { ResetLogoutUseCase } from './ResetLogoutUseCase';

class ResetLogoutController {
  async handle(request: Request, response: Response) {
    const { id } = request.user;
    const clearLogoutUseCase = container.resolve(ResetLogoutUseCase);

    await clearLogoutUseCase.execute(id);

    return response.status(200).json();
  }
}

export { ResetLogoutController };
