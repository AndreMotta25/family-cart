import 'reflect-metadata';
import { MockProxy, mock } from 'jest-mock-extended';
import { v4 } from 'uuid';

import { IUserRepository } from '../repositories/IUserRepository';
import { GetUserUseCase } from '../useCases/GetUser/GetUserUseCase';

let userRepository: MockProxy<IUserRepository>;
let getUserUseCase: GetUserUseCase;

describe('Get User', () => {
  beforeEach(() => {
    userRepository = mock();
    getUserUseCase = new GetUserUseCase(userRepository);
  });

  test('Should return a user', async () => {
    const userId = v4();
    userRepository.findById.mockResolvedValue({
      id: userId,
      email: 'teste@gmail.com',
      name: 'teste',
      password: '1234',
      friends: [],
      sharedList: [],
      sharedListInverse: [],
    });

    const user = await getUserUseCase.execute(userId);
    expect(user.id).toEqual(userId);
  });

  test('An error should occur when not finding a user', async () => {
    await expect(async () => {
      userRepository.findById.mockResolvedValue(null);
      await getUserUseCase.execute(v4());
    }).rejects.toHaveProperty('message', 'User Not Found');
  });
});
