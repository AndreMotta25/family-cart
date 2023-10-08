import { inject, injectable } from 'tsyringe';

import { AppError } from '@errors/AppError';
import { IItemRepository } from '@modules/list/repositories/IItemRepository';
import { IListRepository } from '@modules/list/repositories/IListRepository';

interface IAddItemRequest {
  list_id: string;
  name: string;
  quantity: number;
  url: string;
}

@injectable()
class AddItemUseCase {
  constructor(
    @inject('ListRepository') private listRepository: IListRepository,
    @inject('ItemRepository') private itemRepository: IItemRepository,
  ) {}

  async execute({ list_id, name, quantity, url }: IAddItemRequest) {
    const list = await this.listRepository.getList(list_id);

    if (!list)
      throw new AppError({ message: 'List not found', statusCode: 404 });

    const item = await this.itemRepository.createItem({ name, quantity, url });

    list.itens = [...list.itens, item];

    await this.listRepository.create({ ...list, user: list.owner });
  }
}

export { AddItemUseCase };
