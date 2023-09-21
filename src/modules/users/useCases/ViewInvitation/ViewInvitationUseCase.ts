import { inject, injectable } from 'tsyringe';

import { IInvitationsRepository } from '../../repositories/IInvitationsRepository';

interface IViewInvitationResponse {
  id: string;
  name: string;
  email: string;
}

@injectable()
class ViewInvitationUseCase {
  constructor(
    @inject('InvitationRepository')
    private invitationRepository: IInvitationsRepository,
  ) {}

  async execute(id: string): Promise<IViewInvitationResponse[]> {
    const invitations =
      await this.invitationRepository.findInvitationsByUser(id);

    return invitations.map((inv) => {
      return {
        id: inv.user.id,
        name: inv.user.name,
        email: inv.user.email,
      };
    });
  }
}

export { ViewInvitationUseCase };

/*
    Só vai usar esse useCase quem estiver logado e esse usuario logado não poderá passar outros ids.
    só o dele mesmo, então, o id não ficará publico para ser passado.
*/
