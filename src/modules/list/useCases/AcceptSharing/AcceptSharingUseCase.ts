import { container, inject, injectable } from 'tsyringe';

import { AppError } from '../../../../errors/AppError';
import { INotificationRepository } from '../../../notify/repositories/INotificationRepository';
import { NotifyUseCase } from '../../../notify/useCases/Notify/NotifyUseCase';
import { IPendingListRepository } from '../../repositories/IPendingListRepository';
import { IShareListRepository } from '../../repositories/IShareListRepository';

interface IAcceptSharingRequest {
  guestId: string;
  ownerId: string;
  listId: string;
  notification_id: string;
}

@injectable()
class AcceptSharingUseCase {
  private notifyUseCase: NotifyUseCase;

  constructor(
    @inject('PendingListRepository')
    private pendingRepository: IPendingListRepository,
    @inject('ShareListRepository')
    private shareRepository: IShareListRepository,
    @inject('NotificationRepository')
    private notifyRepository: INotificationRepository,
  ) {
    this.notifyUseCase = container.resolve(NotifyUseCase);
  }

  async execute({
    ownerId,
    guestId,
    listId,
    notification_id,
  }: IAcceptSharingRequest) {
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

    const notificationRead =
      await this.notifyRepository.getNotificationById(notification_id);

    if (notificationRead) {
      notificationRead.notification.read = true;
      await this.notifyRepository.updateNotification({
        notification: notificationRead.notification,
      });
    }

    await this.notifyUseCase.execute(
      ownerId,
      JSON.stringify({
        message: 'Você recebeu uma nova notificação.',
        isNew: 1,
      }),
    );

    await this.pendingRepository.removePendingShare(pendingShare.id);
    return `Voce aceitou participar da lista ${pendingShare.list.name} do ${pendingShare.owner.name}`;
  }
}

export { AcceptSharingUseCase };
