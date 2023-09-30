import { Router } from 'express';
import { isAuthenticated } from 'src/middleware/isAuthenticated';

import { AddItemController } from '@modules/list/useCases/AddItem/AddItemController';
import { CreateListController } from '@modules/list/useCases/CreateList/CreateListController';

const listRoutes = Router();

const createListController = new CreateListController();
const addItemController = new AddItemController();

listRoutes.post('/', isAuthenticated, createListController.handle);
listRoutes.post('/:list_id/add', isAuthenticated, addItemController.handle);

export { listRoutes };
