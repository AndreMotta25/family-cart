import { FamilyMember } from '../entities/FamilyMember';
import { Invitation } from '../entities/Invitation';
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
export interface IAcceptInvite {
  owner: User;
  target: User;
}

interface IInvitationsRepository {
  create(data: ICreateFamiliar): Promise<Invitation>;
  findInvitationsByUser(id: string): Promise<Invitation[]>;
  findInvitation({ owner, target }: IFindInvite): Promise<Invitation | null>;
  deleteInvitation({ owner, target }: IDeleteInvite): Promise<void>;
  acceptInvitation({ target, owner }: IAcceptInvite): Promise<FamilyMember>;
  findInvitationById(id: string): Promise<Invitation | null>;
}

export { IInvitationsRepository };
