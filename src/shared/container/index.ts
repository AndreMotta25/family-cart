import { container } from 'tsyringe';

import { IListRepository } from '@modules/list/repositories/IListRepository';
import { ListRepository } from '@modules/list/repositories/implements/ListRepository';
import { IFamilyMembersRepository } from '@modules/users/repositories/IFamilyMembersRepository';
import { IInvitationsRepository } from '@modules/users/repositories/IInvitationsRepository';
import { FamilyMembersRepository } from '@modules/users/repositories/implementations/FamilyMembersRepository';
import { InvitationsRepository } from '@modules/users/repositories/implementations/InvitationsRepository';
import { UserRepository } from '@modules/users/repositories/implementations/UserRepository';
import { IUserRepository } from '@modules/users/repositories/IUserRepository';

container.registerSingleton<IUserRepository>('UserRepository', UserRepository);
container.registerSingleton<IInvitationsRepository>(
  'InvitationRepository',
  InvitationsRepository,
);
container.registerSingleton<IListRepository>('ListRepository', ListRepository);
container.registerSingleton<IFamilyMembersRepository>(
  'FamilyMembersRepository',
  FamilyMembersRepository,
);
