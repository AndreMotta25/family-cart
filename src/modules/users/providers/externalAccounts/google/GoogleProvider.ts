import { OAuth2Client } from 'google-auth-library';

import { AppError } from '@errors/AppError';

import { IProvider, IProviderResponse } from '../IProvider';

class GoogleProvider implements IProvider {
  private client: OAuth2Client;

  constructor() {
    this.client = new OAuth2Client();
  }

  async verify(token: string): Promise<IProviderResponse> {
    try {
      const ticket = await this.client.verifyIdToken({
        idToken: token,
        audience: process.env.ClientId,
      });
      const payload = ticket.getPayload();

      return {
        email: payload?.email as string,
        id: payload?.sub as string,
        name: payload?.name as string,
      };
    } catch {
      throw new AppError({ message: 'Token Invalido', statusCode: 401 });
    }
  }
}

export { GoogleProvider };
