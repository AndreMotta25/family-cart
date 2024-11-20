import { inject, injectable } from 'tsyringe';

import { IUserRepository } from '@modules/users/repositories/IUserRepository';

import { IFamilyMembersRepository } from '../../repositories/IFamilyMembersRepository';

@injectable()
class GetFriendsUseCase {
  constructor(
    @inject('FamilyMembersRepository')
    private familyMembersRepository: IFamilyMembersRepository,
    @inject('UserRepository')
    private userRepository: IUserRepository,
  ) {}

  async execute(id: string) {
    return this.userRepository.getFriends(id);
  }
}

export { GetFriendsUseCase };
