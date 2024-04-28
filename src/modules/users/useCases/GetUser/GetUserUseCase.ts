import { inject, injectable } from 'tsyringe';

import { AppError } from '@errors/AppError';
import { IShareListRepository } from '@modules/list/repositories/IShareListRepository';
import { INotificationRepository } from '@modules/notify/repositories/INotificationRepository';
import { IFamilyMembersRepository } from '@modules/users/repositories/IFamilyMembersRepository';
import { IUserRepository } from '@modules/users/repositories/IUserRepository';

@injectable()
class GetUserUseCase {
  constructor(
    @inject('UserRepository') private userRepository: IUserRepository,
    @inject('NotificationRepository')
    private notificationRepository: INotificationRepository,
    @inject('FamilyMembersRepository')
    private familyMemberRepository: IFamilyMembersRepository,
    @inject('ShareListRepository')
    private shareListRepository: IShareListRepository,
  ) {}

  async execute(id: string) {
    const user = await this.userRepository.findById(id);

    if (!user)
      throw new AppError({ message: 'User Not Found', statusCode: 404 });

    const totalNotifications =
      await this.notificationRepository.totalOfNotifications(user.id);

    const qtdFriends = await this.familyMemberRepository.getTotalFriends(
      user.id,
    );
    const listsSharedTotal = (
      await this.shareListRepository.findShareByGuest(user.id)
    ).length;

    return {
      name: user.name,
      image: `https://ipfs.filebase.io/ipfs/${user.cid}`,
      totalNotifications,
      totalFriends: qtdFriends,
      listsSharedTotal,
    };
  }
}

export { GetUserUseCase };
