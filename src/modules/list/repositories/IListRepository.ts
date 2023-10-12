import { User } from '@modules/users/entities/User';

import { Item } from '../entities/Item';
import { List } from '../entities/List';

export interface ICreateList {
  name: string;
  user: User;
  itens?: Item[];
  id?: string;
}

interface IListRepository {
  create(data: ICreateList): Promise<List>;
  getList(id: string): Promise<List | null>;
  remove(id: string): Promise<void>;
  findListById(id: string): Promise<List | null>;
}
export { IListRepository };
