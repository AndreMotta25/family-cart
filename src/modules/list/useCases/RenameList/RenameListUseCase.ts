import { inject, injectable } from 'tsyringe';

import { AppError } from '../../../../errors/AppError';
import { IListRepository } from '../../repositories/IListRepository';

interface IRenameListRequest {
  list_id: string;
  owner_id: string;
  new_name: string;
}

@injectable()
class RenameListUseCase {
  constructor(
    @inject('ListRepository') private listRepository: IListRepository,
  ) {}

  async execute({ list_id, owner_id, new_name }: IRenameListRequest) {
    const list = await this.listRepository.findListById(list_id);
    if (!list)
      throw new AppError({ message: 'List not found', statusCode: 404 });

    if (!(list.ownerId === owner_id))
      throw new AppError({
        message: 'Only the owner can change the name of list',
        statusCode: 400,
      });

    await this.listRepository.create({
      ...list,
      name: new_name,
      user: list.owner,
    });
  }
}

export { RenameListUseCase };
