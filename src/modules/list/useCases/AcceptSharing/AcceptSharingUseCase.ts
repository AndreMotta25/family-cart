import { inject, injectable } from 'tsyringe';

import { AppError } from '@errors/AppError';
import { IPendingListRepository } from '@modules/list/repositories/IPendingListRepository';
import { IShareListRepository } from '@modules/list/repositories/IShareListRepository';

interface IAcceptSharingRequest {
  guestId: string;
  ownerId: string;
  listId: string;
}

@injectable()
class AcceptSharingUseCase {
  constructor(
    @inject('PendingListRepository')
    private pendingRepository: IPendingListRepository,
    @inject('ShareListRepository')
    private shareRepository: IShareListRepository,
  ) {}

  async execute({ ownerId, guestId, listId }: IAcceptSharingRequest) {
    const alreadyShared = await this.shareRepository.findShareByGuestAndList({
      listId,
      guestId,
    });

    if (alreadyShared)
      throw new AppError({
        message: 'The list is already being shared with this person',
      });

    const pendingShare = await this.pendingRepository.findPendingShare({
      ownerId,
      guestId,
      listId,
    });

    if (!pendingShare)
      throw new AppError({
        message: 'There is no such thing as a sharing invitation',
        statusCode: 404,
      });

    await this.shareRepository.createShare({
      guest: pendingShare.guest,
      list: pendingShare.list,
      owner: pendingShare.owner,
    });
  }
}

export { AcceptSharingUseCase };