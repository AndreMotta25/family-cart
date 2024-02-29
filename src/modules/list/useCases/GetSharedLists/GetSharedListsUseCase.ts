import { inject, injectable } from 'tsyringe';

import { IShareListRepository } from '@modules/list/repositories/IShareListRepository';

interface IGetSharedListsRequest {
  guest_id: string;
}

@injectable()
class GetSharedListsUseCase {
  constructor(
    @inject('ShareListRepository')
    private shareListRepository: IShareListRepository,
  ) {}

  async execute({ guest_id }: IGetSharedListsRequest) {
    const lists = (
      await this.shareListRepository.findShareByGuest(guest_id)
    ).map((shared) => ({ ...shared.list, owner: { name: shared.owner.name } }));

    return lists;
  }
}

export { GetSharedListsUseCase };
