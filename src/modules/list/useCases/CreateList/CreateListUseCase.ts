import { inject, injectable } from 'tsyringe';

import { AppError } from '@errors/AppError';
import { IListRepository } from '@modules/list/repositories/IListRepository';
import { IUserRepository } from '@modules/users/repositories/IUserRepository';

interface ICreateList {
  name: string;
  owner_id: string;
}
interface ICreateListResponse {
  id: string;
  name: string;
  created_at: Date;
  update_at: Date;
  owner: {
    id: string;
    name: string;
  };
}

@injectable()
class CreateListUseCase {
  constructor(
    @inject('UserRepository') private userRepository: IUserRepository,
    @inject('ListRepository') private listRepository: IListRepository,
  ) {}

  async execute({ name, owner_id }: ICreateList): Promise<ICreateListResponse> {
    const userExists = await this.userRepository.findById(owner_id);

    if (!userExists)
      throw new AppError({ message: 'User Not Found', statusCode: 404 });

    const list = await this.listRepository.create({ name, user: userExists });

    return {
      id: list.id,
      name: list.name,
      created_at: list.created_at,
      update_at: list.update_at,
      owner: {
        id: list.owner.id,
        name: list.owner.name,
      },
    };
  }
}

export { CreateListUseCase };
