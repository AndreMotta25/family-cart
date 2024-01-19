import { database } from 'src/database/index';
import { inject, injectable } from 'tsyringe';
import { Repository } from 'typeorm';

import { FamilyMember } from '@modules/users/entities/FamilyMember';
import { Invitation } from '@modules/users/entities/Invitation';

import { IFamilyMembersRepository } from '../IFamilyMembersRepository';
import {
  IAcceptInvite,
  ICreateFamiliar,
  IDeleteInvite,
  IFindInvite,
  IInvitationsRepository,
} from '../IInvitationsRepository';

@injectable()
class InvitationsRepository implements IInvitationsRepository {
  private repository: Repository<Invitation>;

  constructor(
    @inject('FamilyMembersRepository')
    private familyMembersRepository: IFamilyMembersRepository,
  ) {
    this.repository = database.getRepository(Invitation);
  }
  async findInvitationById(id: string): Promise<Invitation | null> {
    const invitation = await this.repository.findOne({ where: { id } });
    return invitation;
  }

  async acceptInvitation({
    target,
    owner,
  }: IAcceptInvite): Promise<FamilyMember> {
    const confirmation = await this.familyMembersRepository.create({
      target,
      owner,
    });
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
