import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { GetListUseCase } from './GetListUseCase';

class GetListController {
  async handle(request: Request, response: Response) {
    const { id_list } = request.params;

    const getList = container.resolve(GetListUseCase);

    const list = await getList.execute(id_list);

    return response.status(200).json(list);
  }
}

export { GetListController };
