import { database } from 'src/database/index';
import { Repository } from 'typeorm';

import { SharedList } from '@modules/list/entities/SharedList';

import {
  ICreateShareRequest,
  IFindByGuestAndListRequest,
  IShareListRepository,
} from '../IShareListRepository';

class ShareListRepository implements IShareListRepository {
  private repository: Repository<SharedList>;

  constructor() {
    this.repository = database.getRepository(SharedList);
  }
  async findShareByGuestAndList({
    guestId,
    listId,
  }: IFindByGuestAndListRequest): Promise<SharedList | null> {
    const haveShared = await this.repository.findOne({
      where: {
        additionalUserId: guestId,
        listId,
      },
    });
    return haveShared;
  }
  async findShareByList(id_list: string): Promise<SharedList | null> {
    const shared = await this.repository.findOne({
      where: { listId: id_list },
    });
    return shared;
  }

  async createShare(data: ICreateShareRequest): Promise<SharedList> {
    const shared = this.repository.create({
      owner: data.owner,
      additionalUser: data.guest,
      list: data.list,
    });
    await this.repository.save(shared);

    return shared;
  }
  async findShareByListWithRelations(id_list: string): Promise<SharedList[]> {
    const shared = await this.repository.find({
      where: { listId: id_list },
      relations: {
        additionalUser: true,
      },
    });
    return shared;
  }
}

export { ShareListRepository };
