import { inject, injectable } from 'tsyringe';

import { IFamilyMembersRepository } from '../../repositories/IFamilyMembersRepository';

@injectable()
class GetFriendsUseCase {
  constructor(
    @inject('FamilyMembersRepository')
    private familyMembersRepository: IFamilyMembersRepository,
  ) {}

  async execute(id: string) {
    const friends = await this.familyMembersRepository.getFriends(id);
    return friends.map((friend) => ({ ...friend, url: '' }));
  }
}

export { GetFriendsUseCase };
