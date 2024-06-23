import 'reflect-metadata';

import { MockProxy, mock } from 'jest-mock-extended';
import { v4 } from 'uuid';

import { IInvitationsRepository } from '@modules/users/repositories/IInvitationsRepository';
import { IUserRepository } from '@modules/users/repositories/IUserRepository';
import { InviteFamiliarUseCase } from '@modules/users/useCases/InvitationFamiliar/InviteFamiliarUseCase';

import { User } from '../entities/User';
import { IFamilyMembersRepository } from '../repositories/IFamilyMembersRepository';

let userRepository: MockProxy<IUserRepository>;
let inviteRepository: MockProxy<IInvitationsRepository>;
let familyMembersRepository: MockProxy<IFamilyMembersRepository>;

let inviteFamiliarUseCase: InviteFamiliarUseCase;

const user: User = {
  email: 'relaie22@gmail.com',
  password: '12345',
  name: 'relaie',
  friends: [],
  id: v4(),
  sharedList: [],
  sharedListInverse: [],
};
const target: User = {
  email: 'teste@gmail.com',
  password: '12345',
  name: 'teste',
  friends: [],
  id: v4(),
  sharedList: [],
  sharedListInverse: [],
};

describe('Invite a familiar', () => {
  beforeEach(() => {
    userRepository = mock();
    inviteRepository = mock();
    familyMembersRepository = mock();

    inviteFamiliarUseCase = new InviteFamiliarUseCase(
      userRepository,
      inviteRepository,
      familyMembersRepository,
    );
  });
  test('Should send an invitation to a family member', async () => {
    userRepository.findByEmail.mockResolvedValue(target);
    userRepository.findById.mockResolvedValue(user);

    await inviteFamiliarUseCase.execute({
      user_id: user.id,
      kin_email: 'teste@gmail.com',
    });

    expect(inviteRepository.create).toHaveBeenCalled();
  });

  test('An error should occur when not finding the target of the invitation', async () => {
    await expect(async () => {
      const userId = v4();
      userRepository.findByEmail.mockResolvedValue(null);
      userRepository.findById.mockResolvedValue(user);

      await inviteFamiliarUseCase.execute({
        user_id: userId,
        kin_email: 'teste@gmail.com',
      });
    }).rejects.toHaveProperty('message', 'Invitation target not found');
  });

  test('An error should occur when not finding the owner of the invitation', async () => {
    await expect(async () => {
      const userId = v4();
      userRepository.findByEmail.mockResolvedValue(target);
      userRepository.findById.mockResolvedValue(null);

      await inviteFamiliarUseCase.execute({
        user_id: userId,
        kin_email: 'relaie22@gmail.com',
      });
    }).rejects.toHaveProperty('message', 'User NotFound');
  });

  test('An error should occur if an invitation has already been sent', async () => {
    await expect(async () => {
      userRepository.findById.mockResolvedValue(user);

      userRepository.findByEmail.mockResolvedValue(target);

      inviteRepository.findInvitations.mockResolvedValue({
        created_at: new Date(),
        id: v4(),
        user,
        userId: user.id,
        user_pending: target,
        userPendingId: target.id,
      });

      await inviteFamiliarUseCase.execute({
        kin_email: 'teste2@gmail.com',
        user_id: '1234',
      });
    }).rejects.toHaveProperty('message', 'Invitation already sent');
  });
  test('An error should occur if both are already friends', async () => {
    await expect(async () => {
      userRepository.findById.mockResolvedValue(user);
      userRepository.findByEmail.mockResolvedValue(target);

      inviteRepository.findInvitations.mockResolvedValue(null);
      familyMembersRepository.alreadyFriends.mockResolvedValue({
        id: v4(),
        kin: target,
        kinId: target.id,
        user,
        userId: user.id,
      });

      await inviteFamiliarUseCase.execute({
        kin_email: 'teste2@gmail.com',
        user_id: '1234',
      });
    }).rejects.toHaveProperty('message', 'Friendship already exists');
  });
});
