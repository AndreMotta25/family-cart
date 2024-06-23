import { MockProxy, mock } from 'jest-mock-extended';
import { v4 } from 'uuid';

import { List } from '../entities/List';
import { IItemRepository } from '../repositories/IItemRepository';
import { RemoveItemUseCase } from '../useCases/RemoveItem/RemoveItemUseCase';

let itemRepository: MockProxy<IItemRepository>;
let removeItemUseCase: RemoveItemUseCase;

describe('Remove Item', () => {
  beforeEach(() => {
    itemRepository = mock();
    removeItemUseCase = new RemoveItemUseCase(itemRepository);
  });

  test('Should remove a item', async () => {
    const item = {
      id: v4(),
      name: 'item teste',
      quantity: 1,
      url: '',
      list: new List(),
    };
    itemRepository.findItem.mockResolvedValue(item);

    await removeItemUseCase.execute(item.id);
    expect(itemRepository.removeItem).toHaveBeenCalled();
  });

  test('Should occur an error if item not exists', async () => {
    await expect(async () => {
      itemRepository.findItem.mockResolvedValue(null);
      await removeItemUseCase.execute(v4());
    }).rejects.toHaveProperty('message', 'Item Not Found');
    expect(itemRepository.removeItem).not.toHaveBeenCalled();
  });
});
