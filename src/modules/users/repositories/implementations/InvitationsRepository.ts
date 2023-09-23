import { database } from 'src/database/index';
import { Repository } from 'typeorm';

import { Invitation } from '@modules/users/entities/Invitation';

import {
  ICreateFamiliar,
  IDeleteInvite,
  IFindInvite,
  IInvitationsRepository,
} from '../IInvitationsRepository';

class InvitationsRepository implements IInvitationsRepository {
  private repository: Repository<Invitation>;

  constructor() {
    this.repository = database.getRepository(Invitation);
  }
  async findInvitations({
    owner,
    target,
  }: IFindInvite): Promise<Invitation | null> {
    const invitation = await this.repository.findOne({
      where: {
        userId: owner,
        userPendingId: target,
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
