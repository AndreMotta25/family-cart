import { inject, injectable } from 'tsyringe';

import { AppError } from '../../../../errors/AppError';
import { IListRepository } from '../../repositories/IListRepository';

interface IItem {
  id: string;
  name: string;
  quantity: number;
  url: string;
}
interface IListResponse {
  id: string;
  name: string;
  created_at: Date;
  update_at: Date;
  itens: IItem[];
}
@injectable()
class GetListUseCase {
  constructor(
    @inject('ListRepository') private listRepository: IListRepository,
  ) {}

  async execute(id: string): Promise<IListResponse> {
    const list = await this.listRepository.getList(id);

    if (!list)
      throw new AppError({ message: 'List Not Found', statusCode: 404 });

    const itens = list.itens.map((item) => ({
      id: item.id,
      name: item.name,
      quantity: item.quantity,
      url: item.url,
    }));

    return {
      id: list.id,
      name: list.name,
      created_at: list.created_at,
      update_at: list.update_at,
      itens,
    };
  }
}

export { GetListUseCase };
