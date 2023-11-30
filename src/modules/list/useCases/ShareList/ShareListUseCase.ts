import { inject, injectable } from 'tsyringe';

import { AppError } from '@errors/AppError';
import { IListRepository } from '@modules/list/repositories/IListRepository';
import { IPendingListRepository } from '@modules/list/repositories/IPendingListRepository';
import { IShareListRepository } from '@modules/list/repositories/IShareListRepository';
import { INotificationRepository } from '@modules/notify/repositories/INotificationRepository';
import { User } from '@modules/users/entities/User';
import { IFamilyMembersRepository } from '@modules/users/repositories/IFamilyMembersRepository';
import { IUserRepository } from '@modules/users/repositories/IUserRepository';

interface IShareListRequest {
  ownerId: string;
  guestId: string;
  listId: string;
}

@injectable()
class ShareListUseCase {
  constructor(
    @inject('ListRepository') private listRepository: IListRepository,
    @inject('FamilyMembersRepository')
    private familyRepository: IFamilyMembersRepository,
    @inject('PendingListRepository')
    private pendingListRepository: IPendingListRepository,
    @inject('ShareListRepository')
    private shareListRepository: IShareListRepository,
    @inject('NotificationRepository')
    private notifyRepository: INotificationRepository,
    @inject('UserRepository')
    private userRepository: IUserRepository,
  ) {}

  async execute({ ownerId, guestId, listId }: IShareListRequest) {
    if (ownerId === guestId)
      throw new AppError({ message: "You can't share a list with yourself" });

    const listExists = await this.listRepository.findListById(listId);

    if (!listExists)
      throw new AppError({ message: 'List Not Found', statusCode: 404 });

    if (listExists.owner.id !== ownerId) {
      throw new AppError({
        message: 'Only the list owner can share it',
        statusCode: 400,
      });
    }

    const alreadyFriends = await this.familyRepository.alreadyFriends({
      owner: ownerId,
      target: guestId,
    });

    if (!alreadyFriends)
      throw new AppError({
        message: 'Lists can only be shared with friends',
        statusCode: 400,
      });

    const owner = await this.userRepository.findById(ownerId);
    const guest = await this.userRepository.findById(guestId);

    const alreadyShared =
      await this.shareListRepository.findShareByGuestAndList({
        listId: listExists.id,
        guestId,
      });

    if (alreadyShared)
      throw new AppError({ message: 'List already shared', statusCode: 400 });

    const isPending = await this.pendingListRepository.findPendingShare({
      guestId,
      listId,
      ownerId,
    });
    if (isPending)
      throw new AppError({
        message:
          'The list in question has already been shared, you must wait for confirmation of the invitation',
        statusCode: 400,
      });

    const pendingInvite = await this.pendingListRepository.shareTo({
      owner: owner as User,
      to: guest as User,
      list: listExists,
    });

    await this.notifyRepository.create(
      {
        read: false,
        emitterId: owner?.id as string,
        entity_id: listExists.id,
        entity_name: 'list',
        type: 'shareList',
      },
      [guest?.id as string],
    );

    return pendingInvite;
  }
}

export { ShareListUseCase };

// por ultimo, verficar se já não existe um convite para compartilhar a lista
