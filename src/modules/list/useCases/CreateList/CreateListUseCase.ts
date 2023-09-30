import { inject, injectable } from 'tsyringe';

import { AppError } from '@errors/AppError';
import { IListRepository } from '@modules/list/repositories/IListRepository';
import { IUserRepository } from '@modules/users/repositories/IUserRepository';

interface ICreateList {
  name: string;
  owner_id: string;
}

@injectable()
class CreateListUseCase {
  constructor(
    @inject('UserRepository') private userRepository: IUserRepository,
    @inject('ListRepository') private listRepository: IListRepository,
  ) {}

  async execute({ name, owner_id }: ICreateList) {
    const userExists = await this.userRepository.findById(owner_id);

    if (!userExists)
      throw new AppError({ message: 'User Not Found', statusCode: 404 });

    const list = await this.listRepository.create({ name, user: userExists });

    return list;
  }
}

export { CreateListUseCase };
