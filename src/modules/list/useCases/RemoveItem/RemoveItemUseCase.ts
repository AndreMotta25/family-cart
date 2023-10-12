import { inject, injectable } from 'tsyringe';

import { AppError } from '@errors/AppError';
import { IItemRepository } from '@modules/list/repositories/IItemRepository';

@injectable()
class RemoveItemUseCase {
  constructor(
    @inject('ItemRepository') private itemRepository: IItemRepository,
  ) {}

  async execute(item_id: string) {
    const itemExists = await this.itemRepository.findItem(item_id);

    if (!itemExists) {
      throw new AppError({ message: 'Item Not Found', statusCode: 404 });
    }
    await this.itemRepository.removeItem(item_id);
  }
}

export { RemoveItemUseCase };
