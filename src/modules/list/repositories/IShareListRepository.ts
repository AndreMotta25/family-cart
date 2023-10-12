import { User } from '@modules/users/entities/User';

import { List } from '../entities/List';
import { SharedList } from '../entities/SharedList';

export interface ICreateShareRequest {
  list: List;
  owner: User;
  guest: User;
}
interface IFindByGuestAndListRequest {
  guestId: string;
  listId: string;
}

interface IShareListRepository {
  createShare(data: ICreateShareRequest): Promise<SharedList>;
  findShareByList(id_list: string): Promise<SharedList | null>;
  findShareByGuestAndList({
    guestId,
    listId,
  }: IFindByGuestAndListRequest): Promise<SharedList | null>;
}

export { IShareListRepository };
