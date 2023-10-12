import { database } from 'src/database/index';
import { Repository } from 'typeorm';

import { SharedList } from '@modules/list/entities/SharedList';

import {
  ICreateShareRequest,
  IShareListRepository,
} from '../IShareListRepository';

class ShareListRepository implements IShareListRepository {
  private repository: Repository<SharedList>;

  constructor() {
    this.repository = database.getRepository(SharedList);
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
}

export { ShareListRepository };
