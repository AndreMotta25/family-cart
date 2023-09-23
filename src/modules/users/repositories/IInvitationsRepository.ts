import { Invitation } from '@modules/users/entities/Invitation';

import { User } from '../entities/User';

export interface ICreateFamiliar {
  user: User;
  kin: User;
}

export interface IFindInvite {
  owner: string;
  target: string;
}
export interface IDeleteInvite extends IFindInvite {}

interface IInvitationsRepository {
  create(data: ICreateFamiliar): Promise<Invitation>;
  findInvitationsByUser(id: string): Promise<Invitation[]>;
  findInvitations({ owner, target }: IFindInvite): Promise<Invitation | null>;
  deleteInvitation({ owner, target }: IDeleteInvite): Promise<void>;
}

export { IInvitationsRepository };
