import { inject, injectable } from 'tsyringe';

import { AppError } from '@errors/AppError';
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
  ) {}

  async execute({ invitationOwnerId, user_id }: IAcceptInviteRequest) {
    const existsInvitationOwner =
      await this.userRepository.findById(invitationOwnerId);

    if (!existsInvitationOwner)
      throw new AppError({
        message: 'Invitation owner not found',
        statusCode: 404,
      });

    const user = await this.userRepository.findById(user_id);

    if (!user)
      throw new AppError({
        message: 'User not found',
        statusCode: 404,
      });

    await this.invitationRepository.acceptInvitation({
      target: user,
      owner: existsInvitationOwner,
    });

    await this.invitationRepository.deleteInvitation({
      owner: invitationOwnerId,
      target: user_id,
    });
  }
}

export { AcceptInviteUseCase };
