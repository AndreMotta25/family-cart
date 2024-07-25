import { hash } from 'bcryptjs';
import { inject, injectable } from 'tsyringe';

import { AppError } from '../../../../errors/AppError';
import { IUserRepository } from '../../repositories/IUserRepository';

interface IUpdatePasswordRequest {
  id: string;
  new_password: string;
}

@injectable()
class UpdatePasswordUseCase {
  constructor(
    @inject('UserRepository') private userRepository: IUserRepository,
  ) {}

  async execute({ id, new_password }: IUpdatePasswordRequest) {
    const user = await this.userRepository.findById(id);
    if (!user)
      throw new AppError({ message: 'User not found', statusCode: 404 });

    const newPasswordHashed = await hash(new_password, 8);

    user.password = newPasswordHashed;

    await this.userRepository.create({
      ...user,
      login: user.login as 'external' | 'internal',
    });
  }
}

export { UpdatePasswordUseCase };
