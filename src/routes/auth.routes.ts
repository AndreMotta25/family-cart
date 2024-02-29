import { Router } from 'express';
import { isAuthenticated } from 'src/middleware/isAuthenticated';

import { AuthenticateUserController } from '@modules/users/useCases/AuthenticateUser/AuthenticateUserController';
import { AuthenticateUserByProviderController } from '@modules/users/useCases/AuthenticateUserByProvider/AuthenticateUserByProviderController';
import { ResetLogoutController } from '@modules/users/useCases/ResetLogout/ResetLogoutController';

const authRoutes = Router();

const authController = new AuthenticateUserController();
const authProviderController = new AuthenticateUserByProviderController();
const resetLogoutController = new ResetLogoutController();

authRoutes.post('/sign', authController.handle);
authRoutes.post('/sign_provider', authProviderController.handle);
authRoutes.patch(
  '/reset_logout',
  isAuthenticated,
  resetLogoutController.handle,
);

export { authRoutes };
