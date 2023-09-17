import { Router } from 'express';

import { authRoutes } from './auth.routes';
import { userRoutes } from './user.routes';

const routes = Router();

routes.use('/user', userRoutes);
routes.use('/', authRoutes);

export { routes };
