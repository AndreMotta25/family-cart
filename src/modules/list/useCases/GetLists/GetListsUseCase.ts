import { inject, injectable } from 'tsyringe';

import { IListRepository } from '@modules/list/repositories/IListRepository';

@injectable()
class GetListsUseCase {
  constructor(
    @inject('ListRepository') private listRepository: IListRepository,
  ) {}

  async execute(userId: string) {
    const lists = await this.listRepository.findListsByUserId(userId);
    return lists;
  }
}

export { GetListsUseCase };
