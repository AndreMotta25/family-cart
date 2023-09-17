import { Router } from 'express';
import { isAuthenticated } from 'src/middleware/isAuthenticated';

import { CreateUserController } from '@modules/users/useCases/CreateUser/CreateUserController';
import { InviteFamiliarController } from '@modules/users/useCases/InvitationFamiliar/InviteFamiliarController';

const userRoutes = Router();

const createUserController = new CreateUserController();
const inviteFamiliarController = new InviteFamiliarController();

userRoutes.post('/', createUserController.handle);

userRoutes.post('/invite', isAuthenticated, inviteFamiliarController.handle);

export { userRoutes };
