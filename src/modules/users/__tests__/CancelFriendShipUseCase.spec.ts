import 'reflect-metadata';
import { MockProxy, mock } from 'jest-mock-extended';
import { v4 } from 'uuid';

import { User } from '../entities/User';
import { IFamilyMembersRepository } from '../repositories/IFamilyMembersRepository';
import { IUserRepository } from '../repositories/IUserRepository';
import { CancelFriendshipUseCase } from '../useCases/CancelFriendship/CancelFriendshipUseCase';

let userRepository: MockProxy<IUserRepository>;
let familyRepository: MockProxy<IFamilyMembersRepository>;

let cancelFriendshipUseCase: CancelFriendshipUseCase;

const user1: User = {
  id: v4(),
  email: 'teste@gmail.com',
  name: 'teste',
  password: '1234',
  friends: [],
  sharedList: [],
  sharedListInverse: [],
};
const user2: User = {
  id: v4(),
  email: 'teste2@gmail.com',
  name: 'teste2',
  password: '1234',
  friends: [],
  sharedList: [],
  sharedListInverse: [],
};

describe('Cancel a friend relation', () => {
  beforeEach(() => {
    userRepository = mock();
    familyRepository = mock();

    cancelFriendshipUseCase = new CancelFriendshipUseCase(
      userRepository,
      familyRepository,
    );
  });
  test('An error should occur when not finding a user', async () => {
    await expect(async () => {
      userRepository.findById.mockResolvedValueOnce(null);
      await cancelFriendshipUseCase.execute({ id: v4(), id_friend: v4() });
    }).rejects.toHaveProperty('message', 'User Not Found');
  });
  test('An error should occur when not finding the friend', async () => {
    await expect(async () => {
      userRepository.findById.mockResolvedValueOnce(user1);
      userRepository.findById.mockResolvedValueOnce(null);

      await cancelFriendshipUseCase.execute({ id: user1.id, id_friend: v4() });
    }).rejects.toHaveProperty('message', 'Friendly Not Found');
  });
  test('An error should occur when the friendship record cannot be found', async () => {
    await expect(async () => {
      userRepository.findById.mockResolvedValueOnce(user1);
      userRepository.findById.mockResolvedValueOnce(user2);

      familyRepository.alreadyFriends.mockResolvedValue(null);

      await cancelFriendshipUseCase.execute({
        id: user1.id,
        id_friend: user2.id,
      });
    }).rejects.toHaveProperty('message', 'FriendShip Not Exists');
    expect(familyRepository.removeFriend).not.toHaveBeenCalled();
  });
  test('Should break a friendship', async () => {
    userRepository.findById.mockResolvedValueOnce(user1);
    userRepository.findById.mockResolvedValueOnce(user2);

    familyRepository.alreadyFriends.mockResolvedValue({
      id: v4(),
      kinId: user2.id,
      userId: user1.id,
      kin: user2,
      user: user1,
    });

    await cancelFriendshipUseCase.execute({
      id: user1.id,
      id_friend: user2.id,
    });
    expect(familyRepository.removeFriend).toHaveBeenCalled();
  });
});
