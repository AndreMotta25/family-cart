import { database } from 'src/database/index';
import { Repository } from 'typeorm';

import { FamilyMember } from '@modules/users/entities/FamilyMember';

import {
  IAlreadyFriendsRequest,
  IFamilyMembersRepository,
} from '../IFamilyMembersRepository';
import { IAcceptInvite } from '../IInvitationsRepository';

class FamilyMembersRepository implements IFamilyMembersRepository {
  private repository: Repository<FamilyMember>;

  constructor() {
    this.repository = database.getRepository(FamilyMember);
  }
  async alreadyFriends({
    target,
    owner,
  }: IAlreadyFriendsRequest): Promise<FamilyMember | null> {
    const isFriends = await this.repository.findOne({
      where: [
        { kinId: owner, userId: target },
        { kinId: target, userId: owner },
      ],
    });
    return isFriends;
  }
  async create({ target, owner }: IAcceptInvite): Promise<void> {
    const invitation = this.repository.create({
      user: target,
      kin: owner,
      userId: target.id,
      kinId: owner.id,
    });
    await this.repository.save(invitation);
  }
}

export { FamilyMembersRepository };
