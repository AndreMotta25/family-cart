import { User } from '../entities/User';
import { IRequestUser } from '../useCases/CreateUser/CreateUserUseCase';
import { IFriendlyResponse } from './IFamilyMembersRepository';

export interface IAlreadyFriendsRequest {
  target: string;
  owner: string;
}
interface IUserRepository {
  findByEmail(email: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
  create(user: IRequestUser): Promise<User>;
  alreadyFriends({
    owner,
    target,
  }: IAlreadyFriendsRequest): Promise<User | null>;
  getFriends(id: string): Promise<IFriendlyResponse[]>;
  getTotalFriends(id: string): Promise<number>;
}

export { IUserRepository };
