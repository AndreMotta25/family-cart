import { inject, injectable } from 'tsyringe';
import { v4 } from 'uuid';

import { AppError } from '@errors/AppError';
import { IUserRepository } from '@modules/users/repositories/IUserRepository';

@injectable()
class ResetLogoutUseCase {
  constructor(
    @inject('UserRepository') private userRepository: IUserRepository,
  ) {}

  async execute(id: string) {
    const userExists = await this.userRepository.findById(id);

    if (!userExists)
      throw new AppError({ message: 'User Not Found', statusCode: 404 });

    userExists.hash = v4();

    await this.userRepository.create({
      ...userExists,
      login: userExists.login as 'external' | 'internal',
    });
  }
}

export { ResetLogoutUseCase };
