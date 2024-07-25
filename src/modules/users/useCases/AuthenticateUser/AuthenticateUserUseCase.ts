import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import { inject, injectable } from 'tsyringe';

import { AppError } from '../../../../errors/AppError';
import { INotificationRepository } from '../../../notify/repositories/INotificationRepository';
import { IUserRepository } from '../../repositories/IUserRepository';

interface IAuthenticateRequest {
  email: string;
  password: string;
}

interface IAuthenticateResponse {
  user: {
    id: string;
    email: string;
    // name: string;
    // image: string;
  };
  token: string;
  // totalNotifications: number;
}

@injectable()
class AuthenticateUserUseCase {
  constructor(
    @inject('UserRepository') private userRepository: IUserRepository,
    @inject('NotificationRepository')
    private notificationRepository: INotificationRepository,
  ) {}

  async execute({
    email,
    password,
  }: IAuthenticateRequest): Promise<IAuthenticateResponse> {
    const user = await this.userRepository.findByEmail(email);

    if (!user)
      throw new AppError({
        message: 'Email or Password is Incorrect',
        statusCode: 400,
      });

    const passMatch = await compare(password, user.password);

    if (user.login === 'external' && !passMatch) {
      throw new AppError({
        message: 'You created the account with a social login',
        statusCode: 400,
      });
    }

    if (!passMatch) {
      throw new AppError({
        message: 'Email or Password is Incorrect',
        statusCode: 400,
      });
    }
    const token = sign(
      { subject: user.id, hashToken: user.hash },
      String(process.env.Secret),
      {
        expiresIn: Number(process.env.ExpirationTime),
      },
    );

    // const totalNotifications =
    //   await this.notificationRepository.totalOfNotifications(user.id);

    return {
      user: {
        id: user.id,
        email: user.email,
        // name: user.name,
        // image: '',
      },
      token,
      // totalNotifications,
    };
  }
}

export { AuthenticateUserUseCase };
