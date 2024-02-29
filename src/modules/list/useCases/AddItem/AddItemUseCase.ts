import { inject, injectable } from 'tsyringe';

import { AppError } from '@errors/AppError';
import { IItemRepository } from '@modules/list/repositories/IItemRepository';
import { IListRepository } from '@modules/list/repositories/IListRepository';
import { IShareListRepository } from '@modules/list/repositories/IShareListRepository';
import { INotificationRepository } from '@modules/notify/repositories/INotificationRepository';
import { INotifyUseCase } from '@modules/notify/useCases/Notify/INotifyUseCase';
import { IUserRepository } from '@modules/users/repositories/IUserRepository';

interface IAddItemRequest {
  list_id: string;
  name: string;
  quantity: number;
  url: string;
  user_logged_id: string;
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
    @inject('UserRepository') private userRepository: IUserRepository,
    @inject('NotifyUser') private notifyUseCase: INotifyUseCase,
  ) {}

  async execute({
    list_id,
    name,
    quantity,
    url,
    user_logged_id,
  }: IAddItemRequest) {
    const list = await this.listRepository.getList(list_id);

    if (!list)
      throw new AppError({ message: 'List not found', statusCode: 404 });

    const item = await this.itemRepository.createItem({ name, quantity, url });

    const sharedWith =
      await this.shareListRepository.findShareByListWithRelations(list_id);

    const userLogged = await this.userRepository.findById(user_logged_id);

    if (sharedWith.length > 0) {
      const receptors = sharedWith
        .filter(
          (shared) => shared.additionalUserId !== (userLogged?.id as string),
        )
        .map((shared) => shared.additionalUserId);

      if (userLogged?.id !== list.ownerId) receptors.push(list.ownerId);

      await this.notifyRepository.create(
        {
          read: false,
          emitterId: userLogged?.id as string,
          entity_id: list.id,
          entity_name: 'list',
          type: 'addItem',
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

    /*
      Talvez eu tire isso daqui para não precisar do carregamento precoçe dos itens. Acredito que 
      isso seja resolvido passando a key(id) da lista no metodo createItem do repositorio de itens 
    */
    list.itens = [...list.itens, item];

    await this.listRepository.create({ ...list, user: list.owner });
    return item.id;
  }
}

export { AddItemUseCase };
