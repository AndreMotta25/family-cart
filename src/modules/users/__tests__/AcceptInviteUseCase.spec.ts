import 'reflect-metadata';
import { MockProxy, mock } from 'jest-mock-extended';
import { v4 } from 'uuid';

import { IInvitationsRepository } from '../repositories/IInvitationsRepository';
import { IUserRepository } from '../repositories/IUserRepository';
import { AcceptInviteUseCase } from '../useCases/AcceptInvite/AcceptInviteUseCase';

let userRepository: MockProxy<IUserRepository>;
let invitationRepository: MockProxy<IInvitationsRepository>;
let acceptInviteUseCase: AcceptInviteUseCase;
const owner = {
  email: 'teste@gmail.com',
  password: '12345',
  name: 'teste',
  friends: [],
  id: v4(),
  sharedList: [],
  sharedListInverse: [],
};
const target = {
  email: 'teste2@gmail.com',
  password: '12345',
  name: 'teste2',
  friends: [],
  id: v4(),
  sharedList: [],
  sharedListInverse: [],
};

describe('Accept an invitation', () => {
  beforeEach(() => {
    userRepository = mock();
    invitationRepository = mock();
    acceptInviteUseCase = new AcceptInviteUseCase(
      userRepository,
      invitationRepository,
    );
  });

  test('An error should occur because the invitation does not exist', async () => {
    await expect(async () => {
      invitationRepository.findInvitations.mockResolvedValue(null);

      await acceptInviteUseCase.execute({
        invitationOwnerId: owner.id,
        user_id: target.id,
      });
    }).rejects.toHaveProperty('message', 'Invite Not Exists');
    expect(invitationRepository.acceptInvitation).not.toHaveBeenCalled();
  });
  test('Should accept the invitation', async () => {
    userRepository.findById.mockResolvedValueOnce(owner);
    userRepository.findById.mockResolvedValueOnce(target);

    invitationRepository.findInvitations.mockResolvedValue({
      id: v4(),
      user: owner,
      user_pending: target,
      userId: owner.id,
      userPendingId: target.id,
      created_at: new Date(),
    });

    await acceptInviteUseCase.execute({
      invitationOwnerId: owner.id,
      user_id: target.id,
    });

    expect(invitationRepository.acceptInvitation).toHaveBeenCalled();
    expect(invitationRepository.deleteInvitation).toHaveBeenCalled();
  });
});
