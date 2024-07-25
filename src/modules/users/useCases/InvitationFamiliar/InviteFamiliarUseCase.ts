import { inject, injectable } from 'tsyringe';

import { User } from '@modules/users/entities/User';

import { AppError } from '../../../../errors/AppError';
import { INotificationRepository } from '../../../notify/repositories/INotificationRepository';
import { INotifyUseCase } from '../../../notify/useCases/Notify/INotifyUseCase';
import { IFamilyMembersRepository } from '../../repositories/IFamilyMembersRepository';
import { IInvitationsRepository } from '../../repositories/IInvitationsRepository';
import { IUserRepository } from '../../repositories/IUserRepository';

interface IInviteFamiliarRequest {
  user_id: string;
  kin_email: string;
}

@injectable()
class InviteFamiliarUseCase {
  constructor(
    @inject('UserRepository') private userRepository: IUserRepository,
    @inject('InvitationRepository')
    private invitationRepository: IInvitationsRepository,
    @inject('FamilyMembersRepository')
    private familyMembersRepository: IFamilyMembersRepository,
    @inject('NotificationRepository')
    private notifyRepository: INotificationRepository,
    @inject('NotifyUser') private notifyUseCase: INotifyUseCase,
  ) {}

  async execute({ user_id, kin_email }: IInviteFamiliarRequest): Promise<void> {
    const targetExist = await this.userRepository.findByEmail(kin_email);
    const userExist = await this.userRepository.findById(user_id);

    if (user_id === targetExist?.id)
      throw new AppError({
        message: "You can't invite yourself as a friend",
        statusCode: 400,
      });

    if (!targetExist)
      throw new AppError({
        message: 'Invitation target not found',
        statusCode: 404,
      });

    const invitationExists = await this.invitationRepository.findInvitation({
      owner: user_id,
      target: targetExist.id,
    });

    if (invitationExists) {
      throw new AppError({
        message: 'Invitation already sent',
        statusCode: 400,
      });
    }

    const friendshipExists = await this.familyMembersRepository.alreadyFriends({
      target: targetExist.id,
      owner: userExist?.id as string,
    });

    if (friendshipExists)
      throw new AppError({
        message: 'Friendship already exists',
        statusCode: 400,
      });

    const invitation = await this.invitationRepository.create({
      user: userExist as User,
      kin: targetExist,
    });

    await this.notifyRepository.create(
      {
        read: false,
        emitterId: userExist?.id as string,
        entity_id: invitation.id,
        entity_name: 'invitation',
        type: 'invitationFamiliar',
      },
      [targetExist.id],
    );
    // SSE
    await this.notifyUseCase.execute(
      targetExist.id,
      JSON.stringify({
        message: 'Você recebeu uma nova notificação.',
        isNew: 1,
      }),
    );
  }
}

export { InviteFamiliarUseCase };
