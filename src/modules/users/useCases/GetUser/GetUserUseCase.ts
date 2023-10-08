import { inject, injectable } from 'tsyringe';

import { AppError } from '@errors/AppError';
import { IUserRepository } from '@modules/users/repositories/IUserRepository';

@injectable()
class GetUserUseCase {
  constructor(
    @inject('UserRepository') private userRepository: IUserRepository,
  ) {}

  async execute(id: string) {
    const user = await this.userRepository.findById(id);

    if (!user)
      throw new AppError({ message: 'User Not Found', statusCode: 404 });

    return user;
  }
}

export { GetUserUseCase };
