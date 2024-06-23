import { inject, injectable } from 'tsyringe';

import { AppError } from '../../../../errors/AppError';
import { INotificationRepository } from '../../../notify/repositories/INotificationRepository';
import { IPendingListRepository } from '../../repositories/IPendingListRepository';

interface IDeniedSharingUseCase {
  owner_id: string;
  guest_id: string;
  list_id: string;
  notification_id: string;
}

@injectable()
class DeniedSharingUseCase {
  constructor(
    @inject('PendingListRepository')
    private pendingListRepository: IPendingListRepository,
    @inject('NotificationRepository')
    private notifyRepository: INotificationRepository,
  ) {}

  async execute({
    owner_id,
    guest_id,
    list_id,
    notification_id,
  }: IDeniedSharingUseCase) {
    const pendingShare = await this.pendingListRepository.findPendingShare({
      ownerId: owner_id,
      guestId: guest_id,
      listId: list_id,
    });
    if (!pendingShare)
      throw new AppError({ message: 'Invite not found', statusCode: 404 });

    await this.pendingListRepository.removePendingShare(pendingShare.id);
    await this.notifyRepository.removeNotificationById(notification_id);
  }
}

export { DeniedSharingUseCase };
