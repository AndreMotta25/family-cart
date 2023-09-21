import { Invitation } from '@modules/users/entities/Invitation';

import { User } from '../entities/User';

export interface ICreateFamiliar {
  user: User;
  kin: User;
}
interface IInvitationsRepository {
  create(data: ICreateFamiliar): Promise<Invitation>;
  // vai trazer suas relaçoes
  findInvitationsByUser(id: string): Promise<Invitation[]>;
}

export { IInvitationsRepository };
