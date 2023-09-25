import { inject, injectable } from 'tsyringe';

import { AppError } from '@errors/AppError';
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

    const invitationExists = await this.invitationRepository.findInvitations({
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

    await this.invitationRepository.create({
      user: userExist,
      kin: targetExist,
    });
  }
}

export { InviteFamiliarUseCase };
