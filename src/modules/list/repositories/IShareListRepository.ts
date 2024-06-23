import { User } from '../../users/entities/User';
import { List } from '../entities/List';
import { SharedList } from '../entities/SharedList';

export interface ICreateShareRequest {
  list: List;
  owner: User;
  guest: User;
}
export interface IFindByGuestAndListRequest {
  guestId: string;
  listId: string;
}
export interface IIsjoinedInListRequest {
  user_id: string;
  list_id: string;
}

interface IShareListRepository {
  createShare(data: ICreateShareRequest): Promise<SharedList>;
  findShareByList(id_list: string): Promise<SharedList | null>;
  findShareByGuestAndList({
    guestId,
    listId,
  }: IFindByGuestAndListRequest): Promise<SharedList | null>;
  findShareByListWithRelations(id_list: string): Promise<SharedList[]>;
  findShareByGuest(user_id: string): Promise<SharedList[]>;
  isJoinedInList({
    list_id,
    user_id,
  }: IIsjoinedInListRequest): Promise<boolean>;
  cancelSharing(id: string): Promise<void>;
}

export { IShareListRepository };
