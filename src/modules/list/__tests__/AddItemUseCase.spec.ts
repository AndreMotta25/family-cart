import 'reflect-metadata';
import { MockProxy, mock } from 'jest-mock-extended';
import { v4 } from 'uuid';

import { User } from '@modules/users/entities/User';

import { List } from '../entities/List';
import { IItemRepository } from '../repositories/IItemRepository';
import { IListRepository } from '../repositories/IListRepository';
import { AddItemUseCase } from '../useCases/AddItem/AddItemUseCase';

let listRepository: MockProxy<IListRepository>;
let itemRepository: MockProxy<IItemRepository>;

let addItemUseCase: AddItemUseCase;

describe('Create a List', () => {
  beforeEach(() => {
    listRepository = mock();
    itemRepository = mock();
    addItemUseCase = new AddItemUseCase(listRepository, itemRepository);
  });
  test('Should add an item to the list', async () => {
    const owner: User = {
      id: v4(),
      email: 'teste@gmail.com',
      name: 'teste',
      password: '12234',
      friends: [],
      sharedList: [],
      sharedListInverse: [],
    };
    const list: List = {
      id: v4(),
      name: 'list test',
      created_at: new Date(),
      update_at: new Date(),
      itens: [],
      owner,
      aditionalUsers: [],
    };
    listRepository.getList.mockResolvedValue(list);

    await addItemUseCase.execute({
      list_id: list.id,
      name: 'item teste',
      quantity: 2,
      url: '',
    });

    expect(listRepository.create).toHaveBeenCalled();
    expect(itemRepository.createItem).toHaveBeenCalled();
  });

  test('An error should occur due to not finding the list', async () => {
    await expect(async () => {
      listRepository.getList.mockResolvedValue(null);

      await addItemUseCase.execute({
        list_id: v4(),
        name: 'item teste',
        quantity: 2,
        url: '',
      });
    }).rejects.toHaveProperty('message', 'List not found');
    expect(listRepository.create).not.toHaveBeenCalled();
    expect(itemRepository.createItem).not.toHaveBeenCalled();
  });
});
