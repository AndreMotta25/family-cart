import { AppError } from 'src/errors/AppError';
import { inject, injectable } from 'tsyringe';

import { IPendingFamiliarRepository } from '../../repositories/IPendingFamiliarRepository';
import { IUserRepository } from '../../repositories/IUserRepository';

interface IInviteFamiliarRequest {
  user_id: string;
  kin_email: string;
}

@injectable()
class InviteFamiliarUseCase {
  constructor(
    @inject('UserRepository') private userRepository: IUserRepository,
    @inject('PendingFamiliarRepository')
    private pendingRepository: IPendingFamiliarRepository,
  ) {}

  async execute({ user_id, kin_email }: IInviteFamiliarRequest): Promise<void> {
    const familiarExist = await this.userRepository.findByEmail(kin_email);
    const userExist = await this.userRepository.findById(user_id);

    if (!familiarExist || !userExist)
      throw new AppError({ message: 'User NotFound', statusCode: 404 });

    await this.pendingRepository.create({
      user: userExist,
      kin: familiarExist,
    });
  }
}

export { InviteFamiliarUseCase };
