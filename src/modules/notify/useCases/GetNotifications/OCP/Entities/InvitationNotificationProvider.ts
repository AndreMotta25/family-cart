import { inject, injectable } from 'tsyringe';

import { Invitation } from '../../../../../users/entities/Invitation';
import { IInvitationsRepository } from '../../../../../users/repositories/IInvitationsRepository';
import { invitationTemplates } from '../../../../notifications_templates/invitationTemplates';
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
