import { Repository } from 'typeorm';

import { database } from '../../../../database/index';
import { SharedList } from '../../entities/SharedList';
import {
  ICreateShareRequest,
  IFindByGuestAndListRequest,
  IIsjoinedInListRequest,
  IShareListRepository,
} from '../IShareListRepository';

class ShareListRepository implements IShareListRepository {
  private repository: Repository<SharedList>;

  constructor() {
    this.repository = database.getRepository(SharedList);
  }
  async cancelSharing(id: string): Promise<void> {
    await this.repository.delete({ id });
  }
  async isJoinedInList({
    list_id,
    user_id,
  }: IIsjoinedInListRequest): Promise<boolean> {
    const result = await this.findShareByGuestAndList({
      guestId: user_id,
      listId: list_id,
    });
    if (result) return true;
    return false;
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
  async findShareByGuest(user_id: string): Promise<SharedList[]> {
    const shareds = await this.repository.find({
      where: { additionalUserId: user_id },
      relations: { list: true, owner: true },
    });
    return shareds;
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
