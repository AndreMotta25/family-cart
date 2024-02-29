import { Router } from 'express';
import { isAuthenticated } from 'src/middleware/isAuthenticated';

import { GetNotificationsController } from '@modules/notify/useCases/GetNotifications/GetNotificationsController';
import { RealTimeNotificationController } from '@modules/notify/useCases/RealTimeNotification/RealTimeNotificationController';
import { UpdateReadStatusController } from '@modules/notify/useCases/UpdateReadStatus/UpdateReadStatusController';

const notificationsRouter = Router();

const getNotificationsController = new GetNotificationsController();
const realTimeNotifications = new RealTimeNotificationController();
const updateReadtStatusController = new UpdateReadStatusController();

notificationsRouter.get(
  '/',
  isAuthenticated,
  getNotificationsController.handle,
);

notificationsRouter.get(
  '/realtime_notifications',
  isAuthenticated,
  realTimeNotifications.handle,
);
notificationsRouter.patch(
  '/:notification_id/read',
  isAuthenticated,
  updateReadtStatusController.handle,
);

export { notificationsRouter };
