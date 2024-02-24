import { inject, injectable } from 'tsyringe';

import { AppError } from '@errors/AppError';
import { IUserRepository } from '@modules/users/repositories/IUserRepository';

interface IUpdateNameRequest {
  id: string;
  name: string;
}

@injectable()
class UpdateNameUseCase {
  constructor(
    @inject('UserRepository') private userRepository: IUserRepository,
  ) {}

  async execute({ id, name }: IUpdateNameRequest) {
    const user = await this.userRepository.findById(id);

    if (!user)
      throw new AppError({ message: 'User not found', statusCode: 404 });

    user.name = name;

    await this.userRepository.create({
      ...user,
      login: user.login as 'external' | 'internal',
    });
  }
}

export { UpdateNameUseCase };
