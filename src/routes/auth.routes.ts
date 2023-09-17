import { Router } from 'express';

import { AuthenticateUserController } from '@modules/users/useCases/AuthenticateUser/AuthenticateUserController';

const authRoutes = Router();

const authController = new AuthenticateUserController();

authRoutes.post('/sign', authController.handle);

export { authRoutes };
