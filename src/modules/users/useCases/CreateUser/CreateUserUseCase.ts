import { hash } from 'bcryptjs';
import { AppError } from 'src/errors/AppError';
import { inject, injectable } from 'tsyringe';

import { IUserRepository } from '../../repositories/IUserRepository';

export interface IRequestUser {
  name: string;
  email: string;
  password: string;
  id?: string;
}
interface IResponseUser {
  name: string;
  email: string;
  id: string;
}

@injectable()
class CreateUserUseCase {
  constructor(
    @inject('UserRepository') private userRepository: IUserRepository,
  ) {}

  async execute({
    email,
    password,
    name,
  }: IRequestUser): Promise<IResponseUser> {
    const userExists = await this.userRepository.findByEmail(email);

    if (userExists) throw new AppError({ message: 'User already Exists' });

    const hashPassword = await hash(password, 8);

    const user = await this.userRepository.create({
      email,
      password: hashPassword,
      name,
    });

    return {
      id: user.id,
      email: user.email,
      name: user.name,
    };
  }
}

export { CreateUserUseCase };
