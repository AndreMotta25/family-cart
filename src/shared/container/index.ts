import { container } from 'tsyringe';

import { IInvitationsRepository } from '@modules/users/repositories/IInvitationsRepository';
import { InvitationsRepository } from '@modules/users/repositories/implementations/InvitationsRepository';
import { UserRepository } from '@modules/users/repositories/implementations/UserRepository';
import { IUserRepository } from '@modules/users/repositories/IUserRepository';

container.registerSingleton<IUserRepository>('UserRepository', UserRepository);
container.registerSingleton<IInvitationsRepository>(
  'InvitationRepository',
  InvitationsRepository,
);
