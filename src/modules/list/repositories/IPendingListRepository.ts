import { List } from '@modules/list/entities/List';
import { PendingList } from '@modules/list/entities/PendingList';
import { User } from '@modules/users/entities/User';

export interface IShareListRequest {
  owner: User;
  to: User;
  list: List;
}

export interface IPendingShare {
  ownerId: string;
  guestId: string;
  listId: string;
}

interface IPendingListRepository {
  shareTo(data: IShareListRequest): Promise<PendingList>;
  findPendingShare(data: IPendingShare): Promise<PendingList | null>;
  removePendingShare(id: string): Promise<void>;
}

export { IPendingListRepository };
