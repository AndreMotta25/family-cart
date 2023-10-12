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
    const invitationExists = await this.invitationRepository.findInvitations({
      owner: invitationOwnerId,
      target: user_id,
    });

    if (!invitationExists)
      throw new AppError({ message: 'Invite Not Exists', statusCode: 404 });

    await this.invitationRepository.acceptInvitation({
      target: invitationExists.user_pending,
      owner: invitationExists.user,
    });

    await this.invitationRepository.deleteInvitation({
      owner: invitationOwnerId,
      target: user_id,
    });
  }
}

export { AcceptInviteUseCase };
