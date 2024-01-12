import { FamilyMember } from '@modules/users/entities/FamilyMember';

import { INotificationResponse } from '../repositories/implements/NotificationRepository';

const familyMembersTemplates = {
  acceptInvite(notification: INotificationResponse, member: FamilyMember) {
    const { emitter, receptor } = notification;
    console.log('teste');
    return {
      type: 'warning',
      entity_type: 'familyMembers',
      entity_id: member.id,
      message: `O usuario ${emitter.name} aceitou seu convite para ser amigo.`,
      notification_id: notification.id,
      created_at: notification.created_at,
      emitter: {
        id: emitter.id,
        name: emitter.name,
        email: emitter.email,
        avatar: '',
      },
      to: {
        id: receptor.id,
        name: receptor.name,
        email: receptor.email,
        avatar: '',
      },
      action: {
        accept: `${process.env.HOSTLINK}/notifications/${notification.id}/read`,
        reject: ``,
      },
      isRead: notification.read,
    };
  },
};

export { familyMembersTemplates };
