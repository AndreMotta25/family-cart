import { Repository } from 'typeorm';

import { database } from '@database/index';
import { List } from '@modules/list/entities/List';

import { ICreateList, IListRepository } from '../IListRepository';

class ListRepository implements IListRepository {
  private repository: Repository<List>;

  constructor() {
    this.repository = database.getRepository(List);
  }
  async findListsByUserId(userId: string): Promise<List[]> {
    const lists = await this.repository.find({
      where: {
        ownerId: userId,
      },
      order: { update_at: 'DESC' },
    });
    return lists;
  }
  async remove(id: string): Promise<void> {
    await this.repository.delete({ id });
  }
  async getList(id: string): Promise<List | null> {
    const list = await this.repository.findOne({
      where: {
        id,
      },
      relations: {
        itens: true,
        aditionalUsers: true,
        owner: true,
      },
    });
    return list;
  }
  async create(data: ICreateList): Promise<List> {
    const list = this.repository.create({
      ...data,
      update_at: new Date(),
      owner: data.user,
    });
    await this.repository.save(list);

    return list;
  }

  async findListById(id: string) {
    const list = await this.repository.findOne({
      where: {
        id,
      },
      relations: { owner: true },
    });
    return list;
  }
}

export { ListRepository };
