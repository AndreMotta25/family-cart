import { Router } from 'express';

import { authRoutes } from './auth.routes';
import { inviteRoutes } from './invite.routes';
import { listRoutes } from './list.routes';
import { notificationsRouter } from './notifications.routes';
import { userRoutes } from './user.routes';

const routes = Router();

routes.use('/user', userRoutes);
routes.use('/invite', inviteRoutes);
routes.use('/lists', listRoutes);
routes.use('/notifications', notificationsRouter);

routes.use('/', authRoutes);

export { routes };
