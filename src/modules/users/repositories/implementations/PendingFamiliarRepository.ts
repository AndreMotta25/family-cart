import { database } from 'src/database/index';
import { Repository } from 'typeorm';

import { PendingFamiliar } from '../../entities/PendingFamiliar';
import {
  ICreateFamiliar,
  IPendingFamiliarRepository,
} from '../IPendingFamiliarRepository';

class PendingFamiliarRepository implements IPendingFamiliarRepository {
  private repository: Repository<PendingFamiliar>;

  constructor() {
    this.repository = database.getRepository(PendingFamiliar);
  }
  async findInvitationsByUser(id: string): Promise<PendingFamiliar[]> {
    const invitations = await this.repository.find({
      where: { userPendingId: id },
      relations: { user: true },
    });
    return invitations;
  }

  async create({ kin, user }: ICreateFamiliar): Promise<PendingFamiliar> {
    const invitationPending = this.repository.create({
      user,
      user_pending: kin,
    });
    await this.repository.save(invitationPending);

    return invitationPending;
  }
}

export { PendingFamiliarRepository };
