import { Repository } from 'typeorm';

import { database } from '../../../../database/index';
import { Item } from '../../entities/Item';
import { IItemRepository, IItemRequest } from '../IItemRepository';

class ItemRepository implements IItemRepository {
  private repository: Repository<Item>;

  constructor() {
    this.repository = database.getRepository(Item);
  }
  async findItem(id: string): Promise<Item | null> {
    const item = await this.repository.findOne({ where: { id } });
    return item;
  }

  async removeItem(id: string): Promise<void> {
    await this.repository.delete({ id });
  }

  async createItem(item: IItemRequest): Promise<Item> {
    const newItem = this.repository.create({ ...item });
    await this.repository.save(newItem);
    return newItem;
  }
}

export { ItemRepository };
