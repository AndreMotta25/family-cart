import { inject, injectable } from 'tsyringe';

import { AppError } from '../../../../errors/AppError';
import { INotificationRepository } from '../../../notify/repositories/INotificationRepository';
import { INotifyUseCase } from '../../../notify/useCases/Notify/INotifyUseCase';
import { IShareListRepository } from '../../repositories/IShareListRepository';

export interface ICancelSharingRequest {
  list_id: string;
  guest_id: string;
  owner_id: string;
}

@injectable()
class CancelSharingUseCase {
  constructor(
    @inject('ShareListRepository')
    private shareRepository: IShareListRepository,
    @inject('NotificationRepository')
    private notifyRepository: INotificationRepository,
    @inject('NotifyUser') private notifyUseCase: INotifyUseCase,
  ) {}

  async execute({ list_id, guest_id, owner_id }: ICancelSharingRequest) {
    const sharing = await this.shareRepository.findShareByGuestAndList({
      guestId: guest_id,
      listId: list_id,
    });

    if (!sharing)
      throw new AppError({
        message: 'This share does not exist',
        statusCode: 404,
      });
    // deveria lançar uma notificação aqui.
    await this.notifyRepository.create(
      {
        read: false,
        emitterId: owner_id as string,
        entity_id: list_id,
        entity_name: 'list',
        type: 'cancelSharing',
      },
      [guest_id as string],
    );
    await this.notifyUseCase.execute(
      guest_id,
      JSON.stringify({
        message: 'Você recebeu uma nova notificação.',
        isNew: 1,
      }),
    );
    await this.shareRepository.cancelSharing(sharing.id);
  }
}

export { CancelSharingUseCase };
