import { inject, injectable } from 'tsyringe';

import { AppError } from '@errors/AppError';
import { IItemRepository } from '@modules/list/repositories/IItemRepository';
import { IListRepository } from '@modules/list/repositories/IListRepository';
import { IShareListRepository } from '@modules/list/repositories/IShareListRepository';
import { INotificationRepository } from '@modules/notify/repositories/INotificationRepository';

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
    @inject('NotificationRepository')
    private notifyRepository: INotificationRepository,
    @inject('ShareListRepository')
    private shareListRepository: IShareListRepository,
  ) {}

  async execute({ list_id, name, quantity, url }: IAddItemRequest) {
    const list = await this.listRepository.getList(list_id);

    if (!list)
      throw new AppError({ message: 'List not found', statusCode: 404 });

    const item = await this.itemRepository.createItem({ name, quantity, url });

    const sharedWith =
      await this.shareListRepository.findShareByListWithRelations(list_id);

    if (sharedWith.length > 0) {
      const receptors = sharedWith.map((shared) => shared.additionalUserId);
      await this.notifyRepository.create(
        {
          read: false,
          emitterId: list.owner.id,
          entity_id: list.id,
          entity_name: 'list',
          type: 'addItem',
        },
        receptors,
      );
    }

    /*
      Talvez eu tire isso daqui para não precisar do carregamento precoçe dos itens. Acredito que 
      isso seja resolvido passando a key da lista no metodo createItem do repositorio de itens 
    */
    list.itens = [...list.itens, item];

    await this.listRepository.create({ ...list, user: list.owner });
  }
}

export { AddItemUseCase };
