import { User } from '../../users/entities/User';
import { List } from '../entities/List';
import { PendingList } from '../entities/PendingList';

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
