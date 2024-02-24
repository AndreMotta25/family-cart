import { Invitation } from '@modules/users/entities/Invitation';

import { INotificationResponse } from '../repositories/implements/NotificationRepository';

const invitationTemplates = {
  invitationFamiliar(
    notification: INotificationResponse,
    invitation: Invitation,
  ) {
    const { emitter, receptor } = notification;

    return {
      type: 'action',
      entity_type: 'invitation',
      entity_id: invitation.id,
      message: notification.read
        ? `Voce aceitou ser amigo de ${emitter.name}`
        : `O usuario ${emitter.name} está te convidando para ser amigo. Aceita ?`,
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
        accept: `invite/friend/${emitter.id}/accept`,
        reject: `invite/friend/${emitter.id}/denied`,
      },
      isRead: notification.read,
    };
  },
};

export { invitationTemplates };
