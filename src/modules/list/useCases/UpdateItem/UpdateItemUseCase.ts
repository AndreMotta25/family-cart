import { inject, injectable } from 'tsyringe';

import { AppError } from '../../../../errors/AppError';
import { IItemRepository } from '../../repositories/IItemRepository';
import { IListRepository } from '../../repositories/IListRepository';
import { IShareListRepository } from '../../repositories/IShareListRepository';

interface IUpdateItemRequest {
  list_id: string;
  item_id: string;
  user_id: string;
  name: string;
  url: string;
}
@injectable()
class UpdateItemUseCase {
  constructor(
    @inject('ListRepository') private listRepository: IListRepository,
    @inject('ShareListRepository')
    private shareListRepository: IShareListRepository,
    @inject('ItemRepository') private itemRepository: IItemRepository,
  ) {}

  async execute({ list_id, user_id, item_id, name, url }: IUpdateItemRequest) {
    const list = await this.listRepository.findListById(list_id);

    if (!list)
      throw new AppError({ message: 'List not found', statusCode: 404 });

    const onTheList = await this.shareListRepository.isJoinedInList({
      user_id,
      list_id,
    });
    if (!onTheList && list.ownerId !== user_id)
      throw new AppError({
        message: 'Only list participants can change it',
        statusCode: 403,
      });

    let item = await this.itemRepository.findItem(item_id);
    if (!item)
      throw new AppError({ message: 'Item not found', statusCode: 404 });

    item = { ...item, name, url };
    await this.itemRepository.createItem({ ...item });
  }
}

export { UpdateItemUseCase };
