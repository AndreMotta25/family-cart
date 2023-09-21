import { inject, injectable } from 'tsyringe';

import { AppError } from '@errors/AppError';

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
  ) {}

  async execute({ user_id, kin_email }: IInviteFamiliarRequest): Promise<void> {
    const familiarExist = await this.userRepository.findByEmail(kin_email);
    const userExist = await this.userRepository.findById(user_id);

    if (!userExist)
      throw new AppError({ message: 'User NotFound', statusCode: 404 });

    if (!familiarExist)
      throw new AppError({
        message: 'Invitation target not found',
        statusCode: 404,
      });

    await this.invitationRepository.create({
      user: userExist,
      kin: familiarExist,
    });
  }
}

export { InviteFamiliarUseCase };
