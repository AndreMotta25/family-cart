import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { AuthenticateUserUseCase } from './AuthenticateUserUseCase';

class AuthenticateUserController {
  async handle(request: Request, response: Response) {
    const { email, password } = request.body;
    console.log(email);
    const authenticateUserUseCase = container.resolve(AuthenticateUserUseCase);

    const credentials = await authenticateUserUseCase.execute({
      email,
      password,
    });

    return response.status(200).json(credentials);
  }
}

export { AuthenticateUserController };
