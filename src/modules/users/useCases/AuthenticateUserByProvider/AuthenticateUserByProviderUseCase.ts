import { sign } from 'jsonwebtoken';
import { inject, injectable } from 'tsyringe';

import { AppError } from '../../../../errors/AppError';
import { INotificationRepository } from '../../../notify/repositories/INotificationRepository';
import { GoogleProvider } from '../../providers/externalAccounts/google/GoogleProvider';
import { IUserRepository } from '../../repositories/IUserRepository';

export interface IProviders {
  google: GoogleProvider;
}

interface IAuthenticateUserByProvider {
  token: string;
  provider: keyof IProviders;
}

@injectable()
class AuthenticateUserByProviderUseCase {
  private providers: IProviders;

  constructor(
    @inject('UserRepository') private userRepository: IUserRepository,
    @inject('NotificationRepository')
    private notificationRepository: INotificationRepository,
  ) {
    this.providers = {
      google: new GoogleProvider(),
    };
  }
  async execute({ token, provider }: IAuthenticateUserByProvider) {
    if (provider in this.providers) {
      const { email, name } = await this.providers[provider].verify(token);
      const userExists = await this.userRepository.findByEmail(email);

      if (!userExists) {
        const newUser = await this.userRepository.create({
          email,
          name,
          password: '',
          login: 'external',
        });
        const token = sign(
          { subject: newUser.id, hashToken: newUser.hash },
          String(process.env.Secret),
          {
            expiresIn: Number(process.env.ExpirationTime),
          },
        );
        return {
          user: {
            id: newUser.id,
            email: newUser.email,
            name: newUser.name,
          },
          token,
          totalNotifications: 0,
        };
      }
      if (userExists.login === 'internal') {
        throw new AppError({
          statusCode: 401,
          message: `the login has made with credentials`,
        });
      }

      const totalNotifications =
        await this.notificationRepository.totalOfNotifications(userExists.id);

      const accessToken = sign(
        { subject: userExists.id, hashToken: userExists.hash },
        String(process.env.Secret),
        {
          expiresIn: Number(process.env.ExpirationTime),
        },
      );
      return {
        user: {
          id: userExists.id,
          email: userExists.email,
        },
        token: accessToken,
        totalNotifications,
      };
    }
    throw new AppError({
      statusCode: 401,
      message: `The providers ${provider} is not supported`,
    });
  }
}

export { AuthenticateUserByProviderUseCase };

/*
    O usuario vai poder se autenticar e se cadastrar por esse serviço.

    O usuario se cadastrando pelo provider do google, o mesmo não vai ter senha, mas podemos fazer 
    para que posteriormente a senha seja "atualizada".
    */
