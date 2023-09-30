import { Router } from 'express';
import { isAuthenticated } from 'src/middleware/isAuthenticated';

import { AcceptInviteController } from '@modules/users/useCases/AcceptInvite/AcceptInviteController';
import { InviteFamiliarController } from '@modules/users/useCases/InvitationFamiliar/InviteFamiliarController';
import { ViewInvitationController } from '@modules/users/useCases/ViewInvitation/ViewInvitationController';

const inviteRoutes = Router();

const inviteFamiliarController = new InviteFamiliarController();
const viewInvitationController = new ViewInvitationController();
const acceptInviteController = new AcceptInviteController();

inviteRoutes.post('/', isAuthenticated, inviteFamiliarController.handle);
inviteRoutes.post('/accept', isAuthenticated, acceptInviteController.handle);

inviteRoutes.get('/', isAuthenticated, viewInvitationController.handle);

export { inviteRoutes };
