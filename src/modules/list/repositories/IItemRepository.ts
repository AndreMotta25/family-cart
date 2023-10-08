import { Item } from '../entities/Item';

export interface IItemRequest {
  name: string;
  quantity: number;
  url: string;
}

interface IItemRepository {
  removeItem(id: string): Promise<void>;
  createItem(item: IItemRequest): Promise<Item>;
  findItem(id: string): Promise<Item | null>;
}
export { IItemRepository };
