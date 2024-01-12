import { container } from 'tsyringe';

import { FamilyMemberNotificationProvider } from './FamilyMembersNotificationProvider';
import { InvitationNotificationProvider } from './InvitationNotificationProvider';
import { ListNotificationProvider } from './ListNotificationProvider';

const providers = {
  list() {
    return container.resolve(ListNotificationProvider);
  },
  invitation() {
    return container.resolve(InvitationNotificationProvider);
  },
  familyMembers() {
    return container.resolve(FamilyMemberNotificationProvider);
  },
};
export { providers };
