import { User } from '@modules/users/entities/User';

import { Item } from '../entities/Item';
import { List } from '../entities/List';

export interface ICreateList {
  name: string;
  user: User;
  itens?: Item[];
  id?: string;
}
export interface IItemRequest {
  name: string;
  quantity: number;
  url: string;
}

interface IListRepository {
  create(data: ICreateList): Promise<List>;
  getList(id: string): Promise<List | null>;
  createItem(item: IItemRequest): Promise<Item>;
}
export { IListRepository };
