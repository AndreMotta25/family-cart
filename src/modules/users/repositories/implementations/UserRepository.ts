import { Repository } from 'typeorm';

import { database } from '@database/index';
import { User } from '@modules/users/entities/User';
import { IRequestUser } from '@modules/users/useCases/CreateUser/CreateUserUseCase';

import { IUserRepository } from '../IUserRepository';

class UserRepository implements IUserRepository {
  private repository: Repository<User>;

  constructor() {
    this.repository = database.getRepository(User);
  }

  async findById(id: string): Promise<User | null> {
    const user = await this.repository.findOne({
      where: { id },
      relations: {
        sharedList: true,
        sharedListInverse: true,
      },
    });
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.repository.findOne({ where: { email } });
    return user;
  }

  async create(user: IRequestUser): Promise<User> {
    const newUser = this.repository.create({ ...user });
    await this.repository.save(newUser);

    return newUser;
  }
}

export { UserRepository };
