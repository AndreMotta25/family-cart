import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import { inject, injectable } from 'tsyringe';

import { AppError } from '@errors/AppError';
import { IUserRepository } from '@modules/users/repositories/IUserRepository';

interface IAuthenticateRequest {
  email: string;
  password: string;
}

interface IAuthenticateResponse {
  user: {
    id: string;
    email: string;
  };
  token: string;
}

@injectable()
class AuthenticateUserUseCase {
  constructor(
    @inject('UserRepository') private userRepository: IUserRepository,
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

    if (!passMatch) {
      throw new AppError({
        message: 'Email or Password is Incorrect',
        statusCode: 400,
      });
    }
    const token = sign({ subject: user.id }, '1234', { expiresIn: '1d' });

    return {
      user: {
        email: user.email,
        id: user.id,
      },
      token,
    };
  }
}

export { AuthenticateUserUseCase };
