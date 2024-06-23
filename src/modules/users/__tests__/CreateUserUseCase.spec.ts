// eslint-disable-next-line import/no-extraneous-dependencies
import 'reflect-metadata';
import { MockProxy, mock } from 'jest-mock-extended';
import { v4 } from 'uuid';

import { User } from '../entities/User';
import { IUserRepository } from '../repositories/IUserRepository';
import { CreateUserUseCase } from '../useCases/CreateUser/CreateUserUseCase';

let createUserUseCase: CreateUserUseCase;
let userRepository: MockProxy<IUserRepository>;

const user: User = {
  email: 'relaie22@gmail.com',
  password: '12345',
  name: 'relaie',
  friends: [],
  id: v4(),
  sharedList: [],
  sharedListInverse: [],
};

describe('Create a User', () => {
  beforeEach(() => {
    userRepository = mock();
    createUserUseCase = new CreateUserUseCase(userRepository);
  });

  test('Should create a user.', async () => {
    userRepository.findByEmail.mockResolvedValue(null);
    userRepository.create.mockResolvedValue(user);

    const user1 = await createUserUseCase.execute({
      email: 'relaie22@gmail.com',
      password: '12345@',
      name: 'relaie',
    });
    expect(user1).toHaveProperty('id');
  });
  test('No must create a user with an already existing email address', async () => {
    await expect(async () => {
      userRepository.findByEmail.mockResolvedValue(user);

      await createUserUseCase.execute({
        email: 'relaie22@gmail.com',
        password: '12345@',
        name: 'relaie',
      });
    }).rejects.toHaveProperty('message', 'User already Exists');
    expect(userRepository.create).not.toBeCalled();
  });
});
