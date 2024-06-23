import 'reflect-metadata';
import { MockProxy, mock } from 'jest-mock-extended';
import { v4 } from 'uuid';

import { User } from '@modules/users/entities/User';
import { IUserRepository } from '@modules/users/repositories/IUserRepository';

import { IListRepository } from '../repositories/IListRepository';
import { CreateListUseCase } from '../useCases/CreateList/CreateListUseCase';

let listRepository: MockProxy<IListRepository>;
let userRepository: MockProxy<IUserRepository>;

let createListUseCase: CreateListUseCase;

describe('Create a List', () => {
  beforeEach(() => {
    listRepository = mock();
    userRepository = mock();

    createListUseCase = new CreateListUseCase(userRepository, listRepository);
  });
  test('Should create a list', async () => {
    const owner: User = {
      id: v4(),
      email: 'teste@gmail.com',
      name: 'teste',
      password: '12345',
      friends: [],
      sharedList: [],
      sharedListInverse: [],
    };
    userRepository.findById.mockResolvedValue(owner);
    listRepository.create.mockResolvedValue({
      id: v4(),
      aditionalUsers: [],
      created_at: new Date(),
      itens: [],
      name: 'list teste',
      owner,
      update_at: new Date(),
    });

    await createListUseCase.execute({ name: 'list teste', owner_id: owner.id });
    expect(listRepository.create).toHaveBeenCalled();
  });

  test('It should throw an error when not finding the user', async () => {
    await expect(async () => {
      userRepository.findById.mockResolvedValue(null);
      await createListUseCase.execute({ name: 'list teste', owner_id: v4() });
    }).rejects.toHaveProperty('message', 'User Not Found');
  });
});
