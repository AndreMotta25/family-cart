import { FamilyMember } from '../entities/FamilyMember';
import { IAcceptInvite } from './IInvitationsRepository';

export interface IAlreadyFriendsRequest {
  target: string;
  owner: string;
}

interface IFamilyMembersRepository {
  create({ target, owner }: IAcceptInvite): Promise<void>;
  alreadyFriends({
    target,
    owner,
  }: IAlreadyFriendsRequest): Promise<FamilyMember | null>;
}

export { IFamilyMembersRepository };
