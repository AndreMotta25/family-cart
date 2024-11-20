import { Repository } from 'typeorm';

import { database } from '../../../../database/index';
import { User } from '../../entities/User';
import { IRequestUser } from '../../useCases/CreateUser/CreateUserUseCase';
import { IFriendlyResponse } from '../IFamilyMembersRepository';
import { IAlreadyFriendsRequest, IUserRepository } from '../IUserRepository';

class UserRepository implements IUserRepository {
  private repository: Repository<User>;

  constructor() {
    this.repository = database.getRepository(User);
  }
  // refazer
  async getTotalFriends(id: string): Promise<number> {
    const total = await this.repository.count({
      where: { id },
      relations: { friends: true },
    });
    return total;
  }
  async getFriends(id: string): Promise<IFriendlyResponse[]> {
    // const data = await database
    //   .getRepository(User)
    //   .createQueryBuilder('user')
    //   .leftJoinAndSelect('user.friends', 'friend')
    //   .where('user.id = :userId', { userId: id })
    //   .orWhere((qb) => {
    //     const subQuery = qb
    //       .subQuery()
    //       .select('uf.user_id')
    //       .from('UsersFriends', 'uf')
    //       .where('uf.friend_id = :userId', { userId: id })
    //       .getQuery();
    //     return `user.id IN ${subQuery}`;
    //   })
    //   .getMany();

    // console.log(data);
    // const teste = await database
    //   .getRepository(User)
    //   .createQueryBuilder('user')
    //   .leftJoinAndSelect('user.friends', 'friend')
    //   .where('user.id = :userId', { userId: id })
    //   .getMany();

    const teste = await database
      .getRepository(User)
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.friends', 'friend')
      .where('user.id = :userId', { userId: id }) // onde ele iniciou o relacionamento de amizadde
      .orWhere('friend_id = :userId', { userId: id }) // onde ele é amigo.
      .getMany();
    console.log(teste);
    // const friends = data.filter((friend) => {
    //   return friend.id !== id;
    // });
    // console.log(friends);

    return [];
  }
  async alreadyFriends({
    owner,
    target,
  }: IAlreadyFriendsRequest): Promise<User | null> {
    const friend = await this.repository.findOne({
      where: {
        friends: {
          id: target,
        },
        id: owner,
      },
    });
    return friend;
  }

  async findById(id: string): Promise<User | null> {
    const user = await this.repository.findOne({
      where: { id },
      relations: {
        sharedList: true,
        sharedListInverse: true,
        friends: true,
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
