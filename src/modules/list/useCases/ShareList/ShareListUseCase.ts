import { inject, injectable } from 'tsyringe';

import { AppError } from '@errors/AppError';
import { IListRepository } from '@modules/list/repositories/IListRepository';
import { IPendingListRepository } from '@modules/list/repositories/IPendingListRepository';
import { IShareListRepository } from '@modules/list/repositories/IShareListRepository';
import { IFamilyMembersRepository } from '@modules/users/repositories/IFamilyMembersRepository';

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
  ) {}

  async execute({ ownerId, guestId, listId }: IShareListRequest) {
    if (ownerId === guestId)
      throw new AppError({ message: "You can't share a list with yourself" });

    const alreadyFriends = await this.familyRepository.alreadyFriends({
      owner: ownerId,
      target: guestId,
    });

    if (!alreadyFriends)
      throw new AppError({
        message: 'Lists can only be shared with friends',
        statusCode: 400,
      });

    const listExists = await this.listRepository.findListById(listId);

    if (!listExists)
      throw new AppError({ message: 'List Not Found', statusCode: 404 });

    const alreadyShared = await this.shareListRepository.findShareByList(
      listExists.id,
    );

    if (alreadyShared)
      throw new AppError({ message: 'List already shared', statusCode: 400 });

    const pendingInvite = await this.pendingListRepository.shareTo({
      owner: alreadyFriends.user,
      to: alreadyFriends.kin,
      list: listExists,
    });

    return pendingInvite;
  }
}

export { ShareListUseCase };

// por ultimo, verficar se já não existe um convite para compartilhar a lista
