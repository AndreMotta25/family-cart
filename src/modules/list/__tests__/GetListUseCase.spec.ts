import 'reflect-metadata';
import { MockProxy, mock } from 'jest-mock-extended';
import { v4 } from 'uuid';

import { User } from '@modules/users/entities/User';

import { List } from '../entities/List';
import { IListRepository } from '../repositories/IListRepository';
import { GetListUseCase } from '../useCases/GetList/GetListUseCase';

let listRepository: MockProxy<IListRepository>;

let getListUseCase: GetListUseCase;

describe('Create a List', () => {
  beforeEach(() => {
    listRepository = mock();
    getListUseCase = new GetListUseCase(listRepository);
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

    const findList = await getListUseCase.execute(list.id);
    expect(findList).toHaveProperty('id', list.id);
  });

  test('An error should occur due to not finding the list', async () => {
    await expect(async () => {
      listRepository.getList.mockResolvedValue(null);
      await getListUseCase.execute(v4());
    }).rejects.toHaveProperty('message', 'List Not Found');
  });
});
