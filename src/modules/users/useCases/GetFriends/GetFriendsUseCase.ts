import { inject, injectable } from 'tsyringe';

import { IFamilyMembersRepository } from '@modules/users/repositories/IFamilyMembersRepository';

@injectable()
class GetFriendsUseCase {
  constructor(
    @inject('FamilyMembersRepository')
    private familyMembersRepository: IFamilyMembersRepository,
  ) {}

  async execute(id: string) {
    const friends = await this.familyMembersRepository.getFriends(id);
    return friends;
  }
}

export { GetFriendsUseCase };
