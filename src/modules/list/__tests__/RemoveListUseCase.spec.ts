import 'reflect-metadata';
import { MockProxy, mock } from 'jest-mock-extended';
import { v4 } from 'uuid';

import { User } from '@modules/users/entities/User';
import { IUserRepository } from '@modules/users/repositories/IUserRepository';

import { IListRepository } from '../repositories/IListRepository';
import { RemoveListUseCase } from '../useCases/RemoveList/RemoveListUseCase';

let listRepository: MockProxy<IListRepository>;
let userRepository: MockProxy<IUserRepository>;
let removeListUseCase: RemoveListUseCase;

const owner: User = {
  id: v4(),
  email: 'tester@gmail.com',
  name: 'teste',
  password: '1234',
  friends: [],
  sharedList: [],
  sharedListInverse: [],
};

const Notowner: User = {
  id: v4(),
  email: 'tester2@gmail.com',
  name: 'teste2',
  password: '12342',
  friends: [],
  sharedList: [],
  sharedListInverse: [],
};

describe('Remove List', () => {
  beforeEach(() => {
    listRepository = mock();
    userRepository = mock();
    removeListUseCase = new RemoveListUseCase(userRepository, listRepository);
  });

  test('An error should occur if list not found', async () => {
    await expect(async () => {
      userRepository.findById.mockResolvedValue(owner);
      listRepository.findListById.mockResolvedValue(null);

      await removeListUseCase.execute({ owner_id: owner.id, id_list: v4() });
    }).rejects.toHaveProperty('message', 'List Not Found');
    expect(listRepository.remove).not.toHaveBeenCalled();
  });

  test('An error should occur if user not found', async () => {
    await expect(async () => {
      userRepository.findById.mockResolvedValue(null);
      await removeListUseCase.execute({ owner_id: owner.id, id_list: v4() });
    }).rejects.toHaveProperty('message', 'User Not Found');
    expect(listRepository.remove).not.toHaveBeenCalled();
  });

  test('Should remove an list', async () => {
    const list = {
      id: v4(),
      name: 'teste',
      created_at: new Date(),
      update_at: new Date(),
      itens: [],
      owner,
      aditionalUsers: [],
    };
    userRepository.findById.mockResolvedValue(owner);
    listRepository.findListById.mockResolvedValue(list);

    await removeListUseCase.execute({
      owner_id: owner.id,
      id_list: list.id,
    });

    expect(listRepository.remove).toHaveBeenCalled();
  });

  test('An error should occur if the person trying to delete the list is not the owner', async () => {
    await expect(async () => {
      const list = {
        id: v4(),
        name: 'teste',
        created_at: new Date(),
        update_at: new Date(),
        itens: [],
        owner,
        aditionalUsers: [],
      };
      userRepository.findById.mockResolvedValue(Notowner);
      listRepository.findListById.mockResolvedValue(list);

      await removeListUseCase.execute({
        owner_id: Notowner.id,
        id_list: list.id,
      });
    }).rejects.toHaveProperty('message', 'Only the owner can remove the list');
  });
});
