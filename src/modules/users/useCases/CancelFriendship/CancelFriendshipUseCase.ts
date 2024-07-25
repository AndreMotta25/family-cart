import { inject, injectable } from 'tsyringe';

import { AppError } from '../../../../errors/AppError';
import { IFamilyMembersRepository } from '../../repositories/IFamilyMembersRepository';
import { IUserRepository } from '../../repositories/IUserRepository';

interface IRemoveRequest {
  id: string;
  id_friend: string;
}

@injectable()
class CancelFriendshipUseCase {
  constructor(
    @inject('UserRepository') private userRepository: IUserRepository,
    @inject('FamilyMembersRepository')
    private familyRepository: IFamilyMembersRepository,
  ) {}
  async execute({ id, id_friend }: IRemoveRequest) {
    const user = await this.userRepository.findById(id);
    const friend = await this.userRepository.findById(id_friend);

    if (!user)
      throw new AppError({ message: 'User Not Found', statusCode: 404 });

    if (!friend)
      throw new AppError({ message: 'Friendly Not Found', statusCode: 404 });

    const isFriends = await this.familyRepository.alreadyFriends({
      target: id_friend,
      owner: id,
    });

    if (!isFriends)
      throw new AppError({ message: 'FriendShip Not Exists', statusCode: 400 });

    await this.familyRepository.removeFriend(isFriends.id);
  }
}

export { CancelFriendshipUseCase };
