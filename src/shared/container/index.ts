import { container } from 'tsyringe';

import { IItemRepository } from '../../modules/list/repositories/IItemRepository';
import { IListRepository } from '../../modules/list/repositories/IListRepository';
import { ItemRepository } from '../../modules/list/repositories/implements/ItemRepository';
import { ListRepository } from '../../modules/list/repositories/implements/ListRepository';
import { PendingListRepository } from '../../modules/list/repositories/implements/PendingListRepository';
import { ShareListRepository } from '../../modules/list/repositories/implements/ShareListRepository';
import { IPendingListRepository } from '../../modules/list/repositories/IPendingListRepository';
import { IShareListRepository } from '../../modules/list/repositories/IShareListRepository';
import { NotificationRepository } from '../../modules/notify/repositories/implements/NotificationRepository';
import { SseConnectRepository } from '../../modules/notify/repositories/implements/SseConnectRepository';
import { INotificationRepository } from '../../modules/notify/repositories/INotificationRepository';
import { ISseConnectRepository } from '../../modules/notify/repositories/ISseConnectRepository';
import { INotifyUseCase } from '../../modules/notify/useCases/Notify/INotifyUseCase';
import { NotifyUseCase } from '../../modules/notify/useCases/Notify/NotifyUseCase';
import { S3PhotoProvider } from '../../modules/users/providers/photoProvider/implements/S3PhotoProvider';
import { IPhotoProvider } from '../../modules/users/providers/photoProvider/IPhotoProvider';
import { IFamilyMembersRepository } from '../../modules/users/repositories/IFamilyMembersRepository';
import { IInvitationsRepository } from '../../modules/users/repositories/IInvitationsRepository';
import { FamilyMembersRepository } from '../../modules/users/repositories/implementations/FamilyMembersRepository';
import { InvitationsRepository } from '../../modules/users/repositories/implementations/InvitationsRepository';
import { UserRepository } from '../../modules/users/repositories/implementations/UserRepository';
import { IUserRepository } from '../../modules/users/repositories/IUserRepository';

container.registerSingleton<IUserRepository>('UserRepository', UserRepository);
container.registerSingleton<IPendingListRepository>(
  'PendingListRepository',
  PendingListRepository,
);
container.registerSingleton<IShareListRepository>(
  'ShareListRepository',
  ShareListRepository,
);
container.registerSingleton<IItemRepository>('ItemRepository', ItemRepository);
container.registerSingleton<IInvitationsRepository>(
  'InvitationRepository',
  InvitationsRepository,
);
container.registerSingleton<IListRepository>('ListRepository', ListRepository);

container.registerSingleton<INotificationRepository>(
  'NotificationRepository',
  NotificationRepository,
);

container.registerSingleton<IFamilyMembersRepository>(
  'FamilyMembersRepository',
  FamilyMembersRepository,
);

container.registerSingleton<ISseConnectRepository>(
  'SseRepository',
  SseConnectRepository,
);
container.registerSingleton<INotifyUseCase>('NotifyUser', NotifyUseCase);
container.registerSingleton<IPhotoProvider>('PhotoProvider', S3PhotoProvider);
