import { Router } from 'express';

import { AcceptInviteController } from '@modules/users/useCases/AcceptInvite/AcceptInviteController';
import { DeniedInviteController } from '@modules/users/useCases/DeniedInvite/DeniedInviteController';
import { InviteFamiliarController } from '@modules/users/useCases/InvitationFamiliar/InviteFamiliarController';
import { ViewInvitationController } from '@modules/users/useCases/ViewInvitation/ViewInvitationController';

import { isAuthenticated } from '../middleware/isAuthenticated';

const inviteRoutes = Router();

const inviteFamiliarController = new InviteFamiliarController();
const viewInvitationController = new ViewInvitationController();
const acceptInviteController = new AcceptInviteController();
const deniedInviteController = new DeniedInviteController();

inviteRoutes.post('/', isAuthenticated, inviteFamiliarController.handle);
inviteRoutes.post(
  '/friend/:owner_id/accept',
  isAuthenticated,
  acceptInviteController.handle,
);

inviteRoutes.delete(
  '/friend/:owner_id/denied',
  isAuthenticated,
  deniedInviteController.handle,
);

inviteRoutes.get('/', isAuthenticated, viewInvitationController.handle);

export { inviteRoutes };
