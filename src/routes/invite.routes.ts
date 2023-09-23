import { Router } from 'express';
import { isAuthenticated } from 'src/middleware/isAuthenticated';

import { InviteFamiliarController } from '@modules/users/useCases/InvitationFamiliar/InviteFamiliarController';
import { ViewInvitationController } from '@modules/users/useCases/ViewInvitation/ViewInvitationController';

const inviteRoutes = Router();

const inviteFamiliarController = new InviteFamiliarController();
const viewInvitationController = new ViewInvitationController();

inviteRoutes.post('/', isAuthenticated, inviteFamiliarController.handle);
inviteRoutes.get('/', isAuthenticated, viewInvitationController.handle);

export { inviteRoutes };
