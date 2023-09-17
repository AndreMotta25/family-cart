import { User } from '../entities/User';
import { IRequestUser } from '../useCases/CreateUser/CreateUserUseCase';

interface IUserRepository {
  findByEmail(email: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
  create(user: IRequestUser): Promise<User>;
}

export { IUserRepository };
