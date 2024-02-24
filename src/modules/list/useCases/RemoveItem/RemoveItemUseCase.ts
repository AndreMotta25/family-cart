import { inject, injectable } from 'tsyringe';

import { AppError } from '@errors/AppError';
import { List } from '@modules/list/entities/List';
import { IItemRepository } from '@modules/list/repositories/IItemRepository';
import { IListRepository } from '@modules/list/repositories/IListRepository';
import { IShareListRepository } from '@modules/list/repositories/IShareListRepository';
import { INotificationRepository } from '@modules/notify/repositories/INotificationRepository';
import { INotifyUseCase } from '@modules/notify/useCases/Notify/INotifyUseCase';

interface IRemoveItemRequest {
  list_id: string;
  item_id: string;
}
@injectable()
class RemoveItemUseCase {
  constructor(
    @inject('ItemRepository') private itemRepository: IItemRepository,
    @inject('ShareListRepository')
    private shareListRepository: IShareListRepository,
    @inject('NotificationRepository')
    private notifyRepository: INotificationRepository,
    @inject('ListRepository') private listRepository: IListRepository,
    @inject('NotifyUser') private notifyUseCase: INotifyUseCase,
  ) {}

  async execute({ item_id, list_id }: IRemoveItemRequest) {
    const itemExists = await this.itemRepository.findItem(item_id);

    if (!itemExists) {
      throw new AppError({ message: 'Item Not Found', statusCode: 404 });
    }

    const sharedWith =
      await this.shareListRepository.findShareByListWithRelations(list_id);

    if (sharedWith.length > 0) {
      const list = (await this.listRepository.getList(list_id)) as List;
      const receptors = sharedWith.map((shared) => shared.additionalUserId);
      await this.notifyRepository.create(
        {
          read: false,
          emitterId: list.owner.id,
          entity_id: list.id,
          entity_name: 'list',
          type: 'removeItem',
        },
        receptors,
      );
      await this.notifyUseCase.execute(
        receptors,
        JSON.stringify({
          message: 'Você recebeu uma nova notificação.',
          isNew: 1,
        }),
      );
    }

    await this.itemRepository.removeItem(item_id);
  }
}

export { RemoveItemUseCase };
