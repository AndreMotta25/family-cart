import { Repository } from 'typeorm';

import { FamilyMember } from '@modules/users/entities/FamilyMember';

import { database } from '../../../../database/index';
import {
  IAlreadyFriendsRequest,
  IFamilyMembersRepository,
  IFriendlyResponse,
} from '../IFamilyMembersRepository';
import { IAcceptInvite } from '../IInvitationsRepository';

class FamilyMembersRepository implements IFamilyMembersRepository {
  private repository: Repository<FamilyMember>;

  constructor() {
    this.repository = database.getRepository(FamilyMember);
  }
  async getTotalFriends(id_user: string): Promise<number> {
    const total = await this.repository.count({
      where: [
        {
          userId: id_user,
        },
        {
          kinId: id_user,
        },
      ],
    });
    return total;
  }

  async getRelationById(id: string): Promise<FamilyMember | null> {
    const relation = await this.repository.findOne({
      where: {
        id,
      },
    });
    return relation;
  }

  async removeFriend(id_friendship: string): Promise<void> {
    await this.repository.delete({ id: id_friendship });
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
      relations: {
        kin: true,
        user: true,
      },
    });
    return isFriends;
  }
  async create({ target, owner }: IAcceptInvite): Promise<FamilyMember> {
    const invitation = this.repository.create({
      user: target,
      kin: owner,
      userId: target.id,
      kinId: owner.id,
    });
    await this.repository.save(invitation);
    return invitation;
  }

  async getFriends(id: string): Promise<IFriendlyResponse[]> {
    const friends = (
      await this.repository.find({
        where: [
          {
            userId: id,
          },
          {
            kinId: id,
          },
        ],
        relations: { kin: true, user: true },
      })
    ).map((friend) => {
      if (friend.userId === id) {
        return {
          id: friend.kin.id,
          email: friend.kin.email,
          name: friend.kin.name,
        };
      }
      return {
        id: friend.user.id,
        email: friend.user.email,
        name: friend.user.name,
      };
    });

    return friends;
  }
}

export { FamilyMembersRepository };
