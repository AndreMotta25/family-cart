import { inject, injectable } from 'tsyringe';

import { AppError } from '@errors/AppError';
import { INotificationRepository } from '@modules/notify/repositories/INotificationRepository';
import { INotifyUseCase } from '@modules/notify/useCases/Notify/INotifyUseCase';
import { IInvitationsRepository } from '@modules/users/repositories/IInvitationsRepository';
import { IUserRepository } from '@modules/users/repositories/IUserRepository';

interface IAcceptInviteRequest {
  invitationOwnerId: string;
  userLogged_id: string;
  notification_id: string;
}

@injectable()
class AcceptInviteUseCase {
  constructor(
    @inject('UserRepository') private userRepository: IUserRepository,
    @inject('InvitationRepository')
    private invitationRepository: IInvitationsRepository,
    @inject('NotificationRepository')
    private notifyRepository: INotificationRepository,
    @inject('NotifyUser') private notifyUseCase: INotifyUseCase,
  ) {}

  async execute({
    invitationOwnerId,
    userLogged_id,
    notification_id,
  }: IAcceptInviteRequest) {
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
    /*
      Como vou deletar o convite, tenho que deletar a notificação que faz menção a ele também
    */
    await this.notifyRepository.removeNotificationById(notification_id);

    await this.notifyRepository.create(
      {
        emitterId: invitationOwnerId,
        read: true,
        entity_id: confirmation.id,
        entity_name: 'familyMembers',
        type: 'invitationFamiliar',
      },
      [userLogged_id],
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

    await this.notifyUseCase.execute(
      invitationOwnerId,
      JSON.stringify({
        message: 'Você recebeu uma nova notificação.',
        isNew: 1,
      }),
    );
    return `Voce aceitou ser amigo de ${invitationExists.user.name}`;
  }
}

export { AcceptInviteUseCase };
