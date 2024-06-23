import { Repository } from 'typeorm';

import { database } from '@database/index';
import { PendingList } from '@modules/list/entities/PendingList';

import {
  IPendingListRepository,
  IPendingShare,
  IShareListRequest,
} from '../IPendingListRepository';

class PendingListRepository implements IPendingListRepository {
  private repository: Repository<PendingList>;

  constructor() {
    this.repository = database.getRepository(PendingList);
  }
  async removePendingShare(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  async findPendingShare(data: IPendingShare): Promise<PendingList | null> {
    const pendingShare = await this.repository.findOne({
      where: {
        guestId: data.guestId,
        ownerId: data.ownerId,
        listId: data.listId,
      },
      relations: { list: true, owner: true, guest: true },
    });
    return pendingShare;
  }

  async shareTo(data: IShareListRequest): Promise<PendingList> {
    const pending = this.repository.create({
      guest: data.to,
      list: data.list,
      owner: data.owner,
    });
    await this.repository.save(pending);

    return pending;
  }
}

export { PendingListRepository };
