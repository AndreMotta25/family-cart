import { inject, injectable } from 'tsyringe';

import { AppError } from '@errors/AppError';
import { INotificationRepository } from '@modules/notify/repositories/INotificationRepository';
import { IFamilyMembersRepository } from '@modules/users/repositories/IFamilyMembersRepository';

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
  ) {}

  async execute({ user_id, kin_email }: IInviteFamiliarRequest): Promise<void> {
    const targetExist = await this.userRepository.findByEmail(kin_email);
    const userExist = await this.userRepository.findById(user_id);

    if (!userExist)
      throw new AppError({ message: 'User NotFound', statusCode: 404 });

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
      owner: userExist.id,
    });

    if (friendshipExists)
      throw new AppError({
        message: 'Friendship already exists',
        statusCode: 400,
      });

    const invitation = await this.invitationRepository.create({
      user: userExist,
      kin: targetExist,
    });

    await this.notifyRepository.create(
      {
        read: false,
        emitterId: userExist.id,
        entity_id: invitation.id,
        entity_name: 'invitation',
        type: 'invitationFamiliar',
      },
      [targetExist.id],
    );
  }
}

export { InviteFamiliarUseCase };
