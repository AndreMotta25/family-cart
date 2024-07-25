import { inject, injectable } from 'tsyringe';

import { AppError } from '../../../../errors/AppError';
import { IListRepository } from '../../repositories/IListRepository';
import { IShareListRepository } from '../../repositories/IShareListRepository';

interface IIsSharedRequest {
  friend_id: string;
  list_id: string;
}

@injectable()
class IsSharedUseCase {
  constructor(
    @inject('ListRepository') private listRepository: IListRepository,
    @inject('ShareListRepository')
    private shareListRepository: IShareListRepository,
  ) {}

  async execute({ list_id, friend_id }: IIsSharedRequest) {
    const list = await this.listRepository.findListById(list_id);

    if (!list)
      throw new AppError({ message: 'List not found', statusCode: 404 });

    const isJoined = await this.shareListRepository.isJoinedInList({
      list_id,
      user_id: friend_id,
    });
    console.log(isJoined);
    return isJoined;
  }
}

export { IsSharedUseCase };
