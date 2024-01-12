import { Request, Response } from 'express';
import { container } from 'tsyringe';

import {
  AuthenticateUserByProviderUseCase,
  IProviders,
} from './AuthenticateUserByProviderUseCase';

class AuthenticateUserByProviderController {
  async handle(request: Request, response: Response) {
    const { token, provider } = request.query;
    const authenticateUserProvider = container.resolve(
      AuthenticateUserByProviderUseCase,
    );

    const credentials = await authenticateUserProvider.execute({
      token: token as string,
      provider: provider as keyof IProviders,
    });

    return response.status(200).json(credentials);
  }
}

export { AuthenticateUserByProviderController };
