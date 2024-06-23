import 'reflect-metadata';
import { MockProxy, mock } from 'jest-mock-extended';
import { v4 } from 'uuid';

import { FamilyMember } from '@modules/users/entities/FamilyMember';
import { User } from '@modules/users/entities/User';
import { IFamilyMembersRepository } from '@modules/users/repositories/IFamilyMembersRepository';

import { List } from '../entities/List';
import { IListRepository } from '../repositories/IListRepository';
import { IPendingListRepository } from '../repositories/IPendingListRepository';
import { IShareListRepository } from '../repositories/IShareListRepository';
import { ShareListUseCase } from '../useCases/ShareList/ShareListUseCase';

let listRepository: MockProxy<IListRepository>;
let familyMembersRepository: MockProxy<IFamilyMembersRepository>;
let pendingListRepository: MockProxy<IPendingListRepository>;
let shareListRepository: MockProxy<IShareListRepository>;

let shareListUseCase: ShareListUseCase;

const kin: User = {
  id: v4(),
  email: 'teste@gmail.com',
  name: 'teste',
  password: '1234',
  friends: [],
  sharedList: [],
  sharedListInverse: [],
};
const owner: User = {
  id: v4(),
  email: 'teste2@gmail.com',
  name: 'teste2',
  password: '12342',
  friends: [],
  sharedList: [],
  sharedListInverse: [],
};
const list: List = {
  id: v4(),
  name: 'teste',
  owner,
  aditionalUsers: [],
  itens: [],
  created_at: new Date(),
  update_at: new Date(),
};
const member: FamilyMember = {
  id: v4(),
  kin,
  user: owner,
  kinId: kin.id,
  userId: owner.id,
};
describe('Share an list', () => {
  beforeEach(() => {
    listRepository = mock();
    familyMembersRepository = mock();
    pendingListRepository = mock();
    shareListRepository = mock();

    shareListUseCase = new ShareListUseCase(
      listRepository,
      familyMembersRepository,
      pendingListRepository,
      shareListRepository,
    );
  });

  test('An error should occur if the list is shared with self', async () => {
    await expect(async () => {
      const owner = v4();
      await shareListUseCase.execute({
        ownerId: owner,
        guestId: owner,
        listId: v4(),
      });
    }).rejects.toHaveProperty(
      'message',
      "You can't share a list with yourself",
    );
    expect(pendingListRepository.shareTo).not.toHaveBeenCalled();
  });

  test('An error should occur if the list is shared with a non-friend', async () => {
    await expect(async () => {
      familyMembersRepository.alreadyFriends.mockResolvedValue(null);
      await shareListUseCase.execute({
        ownerId: v4(),
        guestId: v4(),
        listId: v4(),
      });
    }).rejects.toHaveProperty(
      'message',
      'Lists can only be shared with friends',
    );
    expect(pendingListRepository.shareTo).not.toHaveBeenCalled();
  });

  test('An error should occur if the list not found', async () => {
    await expect(async () => {
      familyMembersRepository.alreadyFriends.mockResolvedValue(member);

      listRepository.findListById.mockResolvedValue(null);

      await shareListUseCase.execute({
        ownerId: owner.id,
        guestId: kin.id,
        listId: v4(),
      });
    }).rejects.toHaveProperty('message', 'List Not Found');
    expect(pendingListRepository.shareTo).not.toHaveBeenCalled();
  });

  test('An error should occur if the list already shared', async () => {
    await expect(async () => {
      familyMembersRepository.alreadyFriends.mockResolvedValue(member);
      listRepository.findListById.mockResolvedValue(list);

      shareListRepository.findShareByList.mockResolvedValue({
        id: v4(),
        list,
        listId: list.id,
        additionalUser: kin,
        additionalUserId: kin.id,
        owner,
        ownerId: owner.id,
        createdAt: new Date(),
      });

      await shareListUseCase.execute({
        ownerId: owner.id,
        guestId: kin.id,
        listId: list.id,
      });
    }).rejects.toHaveProperty('message', 'List already shared');
    expect(pendingListRepository.shareTo).not.toHaveBeenCalled();
  });

  test('Should be shared a list', async () => {
    familyMembersRepository.alreadyFriends.mockResolvedValue(member);
    listRepository.findListById.mockResolvedValue(list);

    shareListRepository.findShareByList.mockResolvedValue(null);

    await shareListUseCase.execute({
      ownerId: owner.id,
      guestId: kin.id,
      listId: list.id,
    });

    expect(pendingListRepository.shareTo).toHaveBeenCalled();
  });
});
