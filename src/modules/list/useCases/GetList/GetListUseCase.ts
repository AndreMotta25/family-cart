import { inject, injectable } from 'tsyringe';

import { AppError } from '@errors/AppError';
import { IListRepository } from '@modules/list/repositories/IListRepository';

@injectable()
class GetListUseCase {
  constructor(
    @inject('ListRepository') private listRepository: IListRepository,
  ) {}

  async execute(id: string) {
    const list = await this.listRepository.getList(id);

    if (!list)
      throw new AppError({ message: 'List Not Found', statusCode: 404 });

    return list;
  }
}

export { GetListUseCase };
