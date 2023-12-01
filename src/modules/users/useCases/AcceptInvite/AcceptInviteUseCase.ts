import { inject, injectable } from 'tsyringe';

import { AppError } from '@errors/AppError';
import { INotificationRepository } from '@modules/notify/repositories/INotificationRepository';
import { IInvitationsRepository } from '@modules/users/repositories/IInvitationsRepository';
import { IUserRepository } from '@modules/users/repositories/IUserRepository';

interface IAcceptInviteRequest {
  invitationOwnerId: string;
  user_id: string;
}

@injectable()
class AcceptInviteUseCase {
  constructor(
    @inject('UserRepository') private userRepository: IUserRepository,
    @inject('InvitationRepository')
    private invitationRepository: IInvitationsRepository,
    @inject('NotificationRepository')
    private notifyRepository: INotificationRepository,
  ) {}

  async execute({ invitationOwnerId, user_id }: IAcceptInviteRequest) {
    const invitationExists = await this.invitationRepository.findInvitation({
      owner: invitationOwnerId,
      target: user_id,
    });

    if (!invitationExists)
      throw new AppError({ message: 'Invite Not Exists', statusCode: 404 });

    await this.invitationRepository.acceptInvitation({
      target: invitationExists.user_pending,
      owner: invitationExists.user,
    });

    // vamos excluir a notificação antes de excluir o convite;
    await this.notifyRepository.deleteNotificationByInvitation(
      invitationExists.id,
    );

    await this.invitationRepository.deleteInvitation({
      owner: invitationOwnerId,
      target: user_id,
    });
  }
}

export { AcceptInviteUseCase };
