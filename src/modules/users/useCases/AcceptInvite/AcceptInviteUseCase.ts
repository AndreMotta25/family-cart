import { inject, injectable } from 'tsyringe';
import { v4 } from 'uuid';

import { AppError } from '../../../../errors/AppError';
import { INotificationRepository } from '../../../notify/repositories/INotificationRepository';
import { INotifyUseCase } from '../../../notify/useCases/Notify/INotifyUseCase';
import { IInvitationsRepository } from '../../repositories/IInvitationsRepository';
import { IUserRepository } from '../../repositories/IUserRepository';

interface IAcceptInviteRequest {
  invitationOwnerId: string;
  userLogged_id: string;
  notification_id: string;
}

interface ICreateNotificationRequest {
  emitterId: string;
  read: boolean;
  entity_id: string;
  entity_name: string;
  type: string;
  targets: string[];
}
interface INotificationForOwner {
  emitterId: string;
  target: string;
  entity_id: string;
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

    await this.invitationRepository.acceptInvitation({
      target: invitationExists.user_pending,
      owner: invitationExists.user,
    });
    /*
      Como vou deletar o convite, tenho que deletar a notificação que faz menção a ele também
    */
    await this.notifyRepository.removeNotificationById(notification_id);

    await this.createNotification({
      emitterId: invitationOwnerId,
      read: true,
      entity_id: v4(),
      entity_name: 'familyMembers',
      type: 'invitationFamiliar',
      targets: [userLogged_id],
    });

    await this.invitationRepository.deleteInvitation({
      owner: invitationOwnerId,
      target: userLogged_id,
    });

    await this.createNotificationForOwner({
      emitterId: userLogged_id,
      entity_id: v4(),
      target: invitationOwnerId,
    });

    await this.notifyUseCase.execute(
      invitationOwnerId,
      JSON.stringify({
        message: 'Você recebeu uma nova notificação.',
        isNew: 1,
      }),
    );
    return `Voce aceitou ser amigo de ${invitationExists.user.name}`;
  }

  async createNotification({
    emitterId,
    entity_id,
    entity_name,
    type,
    targets,
  }: ICreateNotificationRequest) {
    await this.notifyRepository.create(
      {
        emitterId,
        read: false,
        entity_id,
        entity_name,
        type,
      },
      targets,
    );
  }
  async createNotificationForOwner({
    emitterId,
    target,
    entity_id,
  }: INotificationForOwner) {
    await this.createNotification({
      emitterId,
      read: false,
      entity_id,
      entity_name: 'familyMembers',
      type: 'acceptInvite',
      targets: [target],
    });
  }
}
export { AcceptInviteUseCase };
