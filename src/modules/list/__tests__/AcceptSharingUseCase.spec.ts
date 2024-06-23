import { MockProxy, mock } from 'jest-mock-extended';
import { v4 } from 'uuid';

import { User } from '@modules/users/entities/User';

import { List } from '../entities/List';
import { IPendingListRepository } from '../repositories/IPendingListRepository';
import { IShareListRepository } from '../repositories/IShareListRepository';
import { AcceptSharingUseCase } from '../useCases/AcceptSharing/AcceptSharingUseCase';

let pendingRepository: MockProxy<IPendingListRepository>;
let shareRepository: MockProxy<IShareListRepository>;

let acceptSharingUseCase: AcceptSharingUseCase;

describe('Accept Sharing', () => {
  beforeEach(() => {
    pendingRepository = mock();
    shareRepository = mock();

    acceptSharingUseCase = new AcceptSharingUseCase(
      pendingRepository,
      shareRepository,
    );
  });

  test('Should occur an error if already shared the list', async () => {
    await expect(async () => {
      const list = new List();
      const additionalUser = new User();
      const owner = new User();

      shareRepository.findShareByGuestAndList.mockResolvedValue({
        id: v4(),
        list,
        listId: list.id,
        additionalUser,
        additionalUserId: additionalUser.id,
        owner,
        ownerId: owner.id,
        createdAt: new Date(),
      });

      await acceptSharingUseCase.execute({
        ownerId: owner.id,
        guestId: additionalUser.id,
        listId: list.id,
      });
    }).rejects.toHaveProperty(
      'message',
      'The list is already being shared with this person',
    );

    expect(shareRepository.createShare).not.toHaveBeenCalled();
  });

  test('Should occur an error if not find invitation to share the list', async () => {
    await expect(async () => {
      shareRepository.findShareByGuestAndList.mockResolvedValue(null);
      pendingRepository.findPendingShare.mockResolvedValue(null);

      await acceptSharingUseCase.execute({
        ownerId: v4(),
        guestId: v4(),
        listId: v4(),
      });
    }).rejects.toHaveProperty(
      'message',
      'There is no such thing as a sharing invitation',
    );
    expect(shareRepository.createShare).not.toHaveBeenCalled();
  });

  test('Should be accept an invitation to share a list', async () => {
    const list = new List();
    const additionalUser = new User();
    const owner = new User();

    shareRepository.findShareByGuestAndList.mockResolvedValue(null);

    pendingRepository.findPendingShare.mockResolvedValue({
      id: v4(),
      createdAt: new Date(),
      guest: additionalUser,
      list,
      owner,
      guestId: additionalUser.id,
      listId: list.id,
      ownerId: owner.id,
    });

    await acceptSharingUseCase.execute({
      ownerId: owner.id,
      guestId: additionalUser.id,
      listId: list.id,
    });

    expect(shareRepository.createShare).toHaveBeenCalled();
  });
});
