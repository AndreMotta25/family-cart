import { FamilyMember } from '../entities/FamilyMember';
import { IAcceptInvite } from './IInvitationsRepository';

export interface IAlreadyFriendsRequest {
  target: string;
  owner: string;
}
export interface IFriendlyResponse {
  id: string;
  name: string;
  email: string;
}

interface IFamilyMembersRepository {
  create({ target, owner }: IAcceptInvite): Promise<void>;
  alreadyFriends({
    target,
    owner,
  }: IAlreadyFriendsRequest): Promise<FamilyMember | null>;
  removeFriend(id_friendship: string): Promise<void>;
  getFriends(id: string): Promise<IFriendlyResponse[]>;
}

export { IFamilyMembersRepository };
