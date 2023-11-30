import { inject, injectable } from 'tsyringe';

import { AppError } from '@errors/AppError';
import { IPendingListRepository } from '@modules/list/repositories/IPendingListRepository';
import { IShareListRepository } from '@modules/list/repositories/IShareListRepository';
import { INotificationRepository } from '@modules/notify/repositories/INotificationRepository';

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
    @inject('NotificationRepository')
    private notifyRepository: INotificationRepository,
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

    await this.notifyRepository.create(
      {
        read: false,
        emitterId: pendingShare.guestId as string,
        entity_id: pendingShare.list.id,
        entity_name: 'list',
        type: 'acceptShare',
      },
      [pendingShare.ownerId as string],
    );

    await this.pendingRepository.removePendingShare(pendingShare.id);
  }
}

export { AcceptSharingUseCase };
