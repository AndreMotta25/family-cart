import { inject, injectable } from 'tsyringe';

import { AppError } from '@errors/AppError';
import { INotificationRepository } from '@modules/notify/repositories/INotificationRepository';
import { IInvitationsRepository } from '@modules/users/repositories/IInvitationsRepository';
import { IUserRepository } from '@modules/users/repositories/IUserRepository';

interface IAcceptInviteRequest {
  invitationOwnerId: string;
  userLogged_id: string;
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

  async execute({ invitationOwnerId, userLogged_id }: IAcceptInviteRequest) {
    const invitationExists = await this.invitationRepository.findInvitation({
      owner: invitationOwnerId,
      target: userLogged_id,
    });

    if (!invitationExists)
      throw new AppError({ message: 'Invite Not Exists', statusCode: 404 });

    const confirmation = await this.invitationRepository.acceptInvitation({
      target: invitationExists.user_pending,
      owner: invitationExists.user,
    });

    // vamos excluir a notificação antes de excluir o convite;
    await this.notifyRepository.deleteNotificationByInvitation(
      invitationExists.id,
    );

    await this.invitationRepository.deleteInvitation({
      owner: invitationOwnerId,
      target: userLogged_id,
    });

    await this.notifyRepository.create(
      {
        emitterId: userLogged_id,
        read: false,
        entity_id: confirmation.id,
        entity_name: 'familyMembers',
        type: 'acceptInvite',
      },
      [invitationOwnerId],
    );
  }
}

export { AcceptInviteUseCase };
