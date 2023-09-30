import { database } from 'src/database/index';
import { Repository } from 'typeorm';

import { Item } from '@modules/list/entities/Item';
import { List } from '@modules/list/entities/List';

import { ICreateList, IItemRequest, IListRepository } from '../IListRepository';

class ListRepository implements IListRepository {
  private repository: Repository<List>;
  private repositoryItens: Repository<Item>;

  constructor() {
    this.repository = database.getRepository(List);
    this.repositoryItens = database.getRepository(Item);
  }
  async getList(id: string): Promise<List | null> {
    const list = await this.repository.findOne({
      where: {
        id,
      },
      relations: { itens: true },
    });
    return list;
  }
  async create(data: ICreateList): Promise<List> {
    const list = this.repository.create({
      ...data,
      owner: data.user,
    });
    console.log(list);
    await this.repository.save(list);

    return list;
  }

  async createItem(item: IItemRequest) {
    const newItem = this.repositoryItens.create({ ...item });
    await this.repositoryItens.save(newItem);
    return newItem;
  }
}

export { ListRepository };
