import { inject, injectable } from 'tsyringe';

import { invitationTemplates } from '@modules/notify/notifications_templates/invitationTemplates';
import { Invitation } from '@modules/users/entities/Invitation';
import { IInvitationsRepository } from '@modules/users/repositories/IInvitationsRepository';

import {
  INotificationsGrouped,
  IResponse,
} from '../../GetNotificationsUseCase';
import { IGetNotification } from '../IGetNotification';

@injectable()
class InvitationNotificationProvider implements IGetNotification {
  constructor(
    @inject('InvitationRepository')
    private invitationRepository: IInvitationsRepository,
  ) {}

  async getNotifications(
    objectNotification: INotificationsGrouped,
  ): Promise<IResponse[]> {
    const invitation = (await this.invitationRepository.findInvitationById(
      objectNotification.entity_id,
    )) as Invitation;
    return objectNotification.notifications.map((notification) => {
      const type = notification.type as 'invitationFamiliar';
      return invitationTemplates[type](notification, invitation);
    });
  }
}

export { InvitationNotificationProvider };
