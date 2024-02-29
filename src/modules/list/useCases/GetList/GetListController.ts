import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { GetListUseCase } from './GetListUseCase';

class GetListController {
  async handle(request: Request, response: Response) {
    const { list_id } = request.params;

    const getList = container.resolve(GetListUseCase);

    const list = await getList.execute(list_id);

    return response.status(200).json(list);
  }
}

export { GetListController };
