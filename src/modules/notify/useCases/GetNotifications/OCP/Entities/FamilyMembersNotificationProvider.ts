import { inject, injectable } from 'tsyringe';

import { familyMembersTemplates } from '@modules/notify/notifications_templates/familyMembersTemplates';
import { FamilyMember } from '@modules/users/entities/FamilyMember';
import { IFamilyMembersRepository } from '@modules/users/repositories/IFamilyMembersRepository';

import {
  INotificationsGrouped,
  IResponse,
} from '../../GetNotificationsUseCase';
import { IGetNotification } from '../IGetNotification';

@injectable()
class FamilyMemberNotificationProvider implements IGetNotification {
  constructor(
    @inject('FamilyMembersRepository')
    private familyMembersRepository: IFamilyMembersRepository,
  ) {}

  async getNotifications(
    objectNotification: INotificationsGrouped,
  ): Promise<IResponse[]> {
    const relation = (await this.familyMembersRepository.getRelationById(
      objectNotification.entity_id,
    )) as FamilyMember;

    return objectNotification.notifications.map((notification) => {
      const type = notification.type as 'acceptInvite';
      return familyMembersTemplates[type](notification, relation);
    });
  }
}

export { FamilyMemberNotificationProvider };
