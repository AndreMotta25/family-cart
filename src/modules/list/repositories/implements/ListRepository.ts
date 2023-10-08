import { database } from 'src/database/index';
import { Repository } from 'typeorm';

import { List } from '@modules/list/entities/List';

import { ICreateList, IListRepository } from '../IListRepository';

class ListRepository implements IListRepository {
  private repository: Repository<List>;

  constructor() {
    this.repository = database.getRepository(List);
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
}

export { ListRepository };
