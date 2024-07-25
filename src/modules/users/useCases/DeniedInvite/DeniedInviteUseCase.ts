import { inject, injectable } from 'tsyringe';

import { AppError } from '../../../../errors/AppError';
import { INotificationRepository } from '../../../notify/repositories/INotificationRepository';
import { IInvitationsRepository } from '../../repositories/IInvitationsRepository';

interface IDeniedInviteUseCase {
  owner_id: string;
  guest_id: string;
  notification_id: string;
}

@injectable()
class DeniedInviteUseCase {
  constructor(
    @inject('NotificationRepository')
    private notificationRepository: INotificationRepository,
    @inject('InvitationRepository')
    private invitationRepository: IInvitationsRepository,
  ) {}

  async execute({ guest_id, notification_id, owner_id }: IDeniedInviteUseCase) {
    const invite = await this.invitationRepository.findInvitation({
      owner: owner_id,
      target: guest_id,
    });

    if (!invite)
      throw new AppError({ message: 'Invite not found', statusCode: 404 });

    await this.invitationRepository.deleteInvitation({
      owner: owner_id,
      target: guest_id,
    });

    await this.notificationRepository.removeNotificationById(notification_id);
  }
}

export { DeniedInviteUseCase };
