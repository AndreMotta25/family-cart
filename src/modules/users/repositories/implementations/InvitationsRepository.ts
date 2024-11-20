import { inject, injectable } from 'tsyringe';
import { Repository } from 'typeorm';

import { User } from '@modules/users/entities/User';

import { database } from '../../../../database/index';
// import { FamilyMember } from '../../entities/FamilyMember';
import { Invitation } from '../../entities/Invitation';
import { IFamilyMembersRepository } from '../IFamilyMembersRepository';
import {
  IAcceptInvite,
  IAcceptInviteResponse,
  ICreateFamiliar,
  IDeleteInvite,
  IFindInvite,
  IInvitationsRepository,
} from '../IInvitationsRepository';
import { IUserRepository } from '../IUserRepository';

@injectable()
class InvitationsRepository implements IInvitationsRepository {
  private repository: Repository<Invitation>;

  constructor(
    @inject('FamilyMembersRepository')
    private familyMembersRepository: IFamilyMembersRepository,
    @inject('UserRepository') private userRepository: IUserRepository,
  ) {
    this.repository = database.getRepository(Invitation);
  }
  async findInvitationById(id: string): Promise<Invitation | null> {
    const invitation = await this.repository.findOne({
      where: { id },
      relations: { user: true },
    });
    return invitation;
  }

  async acceptInvitation({
    target,
    owner,
  }: IAcceptInvite): Promise<IAcceptInviteResponse> {
    const user = (await this.userRepository.findById(owner.id)) as User;

    user.friends = [...user.friends, target];

    await this.userRepository.create({
      ...user,
      login: user.login as 'external' | 'internal',
    });
    const confirmation = {
      userId: target.id,
      friendId: owner.id,
    };
    return confirmation;
  }

  async findInvitation({
    owner,
    target,
  }: IFindInvite): Promise<Invitation | null> {
    const invitation = await this.repository.findOne({
      where: {
        userId: owner,
        userPendingId: target,
      },
      relations: {
        user: true,
        user_pending: true,
      },
    });
    return invitation;
  }

  async deleteInvitation({ owner, target }: IDeleteInvite): Promise<void> {
    await this.repository.delete({ userId: owner, userPendingId: target });
  }

  async findInvitationsByUser(id: string): Promise<Invitation[]> {
    const invitations = await this.repository.find({
      where: { userPendingId: id },
      relations: { user: true },
    });
    return invitations;
  }
  async create({ kin, user }: ICreateFamiliar): Promise<Invitation> {
    const invitationPending = this.repository.create({
      user,
      user_pending: kin,
    });
    await this.repository.save(invitationPending);

    return invitationPending;
  }
}

export { InvitationsRepository };
