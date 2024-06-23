import 'reflect-metadata';
import { hash } from 'bcryptjs';
import { MockProxy, mock } from 'jest-mock-extended';
import { v4 } from 'uuid';

import { IUserRepository } from '../repositories/IUserRepository';
import { AuthenticateUserUseCase } from '../useCases/AuthenticateUser/AuthenticateUserUseCase';

let userRepository: MockProxy<IUserRepository>;
let authenticateUserUseCase: AuthenticateUserUseCase;

describe('Authenticate User', () => {
  beforeEach(() => {
    userRepository = mock();
    authenticateUserUseCase = new AuthenticateUserUseCase(userRepository);
  });
  test('Should authenticate a user', async () => {
    const hashedPassword = await hash('12345', 8);
    userRepository.findByEmail.mockResolvedValue({
      email: 'teste@gmail.com',
      id: v4(),
      name: 'teste',
      password: hashedPassword,
      friends: [],
      sharedList: [],
      sharedListInverse: [],
    });

    const credentials = await authenticateUserUseCase.execute({
      email: 'teste@gmail.com',
      password: '12345',
    });

    expect(credentials).toHaveProperty('token');
  });

  test('An error should occur if the user was not found by email', async () => {
    await expect(async () => {
      userRepository.findByEmail.mockResolvedValue(null);

      await authenticateUserUseCase.execute({
        email: 'teste@gmail.com',
        password: '12345',
      });
    }).rejects.toHaveProperty('message', 'Email or Password is Incorrect');
  });

  test('An error should occur if the passwords do not match', async () => {
    await expect(async () => {
      const hashedPassword = await hash('123456', 8);
      userRepository.findByEmail.mockResolvedValue({
        email: 'teste@gmail.com',
        id: v4(),
        name: 'teste',
        password: hashedPassword,
        friends: [],
        sharedList: [],
        sharedListInverse: [],
      });

      await authenticateUserUseCase.execute({
        email: 'teste@gmail.com',
        password: '12345',
      });
    }).rejects.toHaveProperty('message', 'Email or Password is Incorrect');
  });
});
