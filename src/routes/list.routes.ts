import { Router } from 'express';

import { AcceptSharingController } from '@modules/list/useCases/AcceptSharing/AcceptSharingController';
import { AddItemController } from '@modules/list/useCases/AddItem/AddItemController';
import { CancelSharingController } from '@modules/list/useCases/CancelSharing/CancelSharingController';
import { CreateListController } from '@modules/list/useCases/CreateList/CreateListController';
import { DeniedSharingController } from '@modules/list/useCases/DeniedSharing/DeniedSharingController';
import { GetListController } from '@modules/list/useCases/GetList/GetListController';
import { GetListsController } from '@modules/list/useCases/GetLists/GetListsController';
import { GetSharedListsController } from '@modules/list/useCases/GetSharedLists/GetSharedListsController';
import { IsSharedController } from '@modules/list/useCases/IsShared/IsSharedController';
import { RemoveItemController } from '@modules/list/useCases/RemoveItem/RemoveItemController';
import { RemoveListController } from '@modules/list/useCases/RemoveList/RemoveListController';
import { RenameListController } from '@modules/list/useCases/RenameList/RenameListController';
import { ShareListController } from '@modules/list/useCases/ShareList/ShareListController';
import { UpdateItemController } from '@modules/list/useCases/UpdateItem/UpdateItemController';

import { isAuthenticated } from '../middleware/isAuthenticated';

const listRoutes = Router();

const createListController = new CreateListController();
const addItemController = new AddItemController();
const getListController = new GetListController();
const removeListController = new RemoveListController();
const shareListController = new ShareListController();
const acceptShareController = new AcceptSharingController();
const getListsController = new GetListsController();
const removeItemController = new RemoveItemController();
const deniedSharingController = new DeniedSharingController();
const updateItemController = new UpdateItemController();
const isSharedController = new IsSharedController();
const cancelSharingController = new CancelSharingController();
const renameListController = new RenameListController();
const getSharedListUseCase = new GetSharedListsController();

listRoutes.post('/', isAuthenticated, createListController.handle);

/*
  Os menos especificos ficam em cima e os mais especificos ficam logo abaixo(GET). 
*/
listRoutes.get('/', isAuthenticated, getListsController.handle);
listRoutes.get('/sharedLists', isAuthenticated, getSharedListUseCase.handle);

listRoutes.post(
  '/:list_id/item/add',
  isAuthenticated,
  addItemController.handle,
);
listRoutes.post(
  '/share_list/:list_id',
  isAuthenticated,
  shareListController.handle,
);
listRoutes.post(
  '/:list_id/accept_share',
  isAuthenticated,
  acceptShareController.handle,
);
listRoutes.get(
  `/:list_id/friends/:friend_id/alreadyShared`,
  isAuthenticated,
  isSharedController.handle,
);
listRoutes.get('/:list_id', isAuthenticated, getListController.handle);

listRoutes.patch(
  '/:list_id/item/:item_id',
  isAuthenticated,
  updateItemController.handle,
);
listRoutes.patch('/:list_id', isAuthenticated, renameListController.handle);

listRoutes.delete(
  '/:list_id/item/:id_item',
  isAuthenticated,
  removeItemController.handle,
);
listRoutes.delete('/:list_id', isAuthenticated, removeListController.handle);
listRoutes.delete(
  '/:list_id/denied_share',
  isAuthenticated,
  deniedSharingController.handle,
);
listRoutes.delete(
  '/:list_id/friends/:guest_id/cancelSharing',
  isAuthenticated,
  cancelSharingController.handle,
);
export { listRoutes };
