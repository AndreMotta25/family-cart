import { PendingFamiliar } from '../entities/PendingFamiliar';
import { User } from '../entities/User';

export interface ICreateFamiliar {
  user: User;
  kin: User;
}
interface IPendingFamiliarRepository {
  create(data: ICreateFamiliar): Promise<PendingFamiliar>;
  // vai trazer suas relaçoes
  findInvitationsByUser(id: string): Promise<PendingFamiliar[]>;
}

export { IPendingFamiliarRepository };
