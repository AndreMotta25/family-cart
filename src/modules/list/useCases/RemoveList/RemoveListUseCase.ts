import { inject, injectable } from 'tsyringe';

import { AppError } from '@errors/AppError';
import { List } from '@modules/list/entities/List';
import { IListRepository } from '@modules/list/repositories/IListRepository';
import { IShareListRepository } from '@modules/list/repositories/IShareListRepository';
import { INotificationRepository } from '@modules/notify/repositories/INotificationRepository';
import { IUserRepository } from '@modules/users/repositories/IUserRepository';

interface IRemoveListResquest {
  owner_id: string;
  id_list: string;
}

@injectable()
class RemoveListUseCase {
  constructor(
    @inject('UserRepository') private userRepository: IUserRepository,
    @inject('ListRepository') private listRepository: IListRepository,
    @inject('ShareListRepository')
    private shareListRepository: IShareListRepository,
    @inject('NotificationRepository')
    private notifyRepository: INotificationRepository,
  ) {}

  async execute({ owner_id, id_list }: IRemoveListResquest) {
    const ownerExists = await this.userRepository.findById(owner_id);
    const listExists = (await this.listRepository.getList(id_list)) as List;

    if (!ownerExists)
      throw new AppError({ message: 'User Not Found', statusCode: 404 });

    if (!listExists)
      throw new AppError({ message: 'List Not Found', statusCode: 404 });

    if (!(ownerExists.id === listExists.owner.id))
      throw new AppError({ message: 'Only the owner can remove the list' });

    const sharedWith =
      await this.shareListRepository.findShareByListWithRelations(id_list);

    if (sharedWith.length > 0) {
      const receptors = sharedWith.map((shared) => shared.additionalUserId);
      await this.notifyRepository.create(
        {
          read: false,
          emitterId: listExists.owner.id,
          entity_id: listExists.id,
          entity_name: 'list',
          type: 'removeList',
        },
        receptors,
      );
    }

    await this.listRepository.remove(id_list);
  }
}

export { RemoveListUseCase };
