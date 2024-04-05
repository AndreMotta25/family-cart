import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { UploadAvatarUseCase } from './UploadAvatarUseCase';

class UploadAvatarController {
  async handle(request: Request, response: Response) {
    const { file } = request;
    const { id } = request.user;
    console.log('aqui');
    const filePath = `${file?.destination}/${file?.filename}`;

    const uploadAvatarUseCase = container.resolve(UploadAvatarUseCase);

    await uploadAvatarUseCase.execute({ file: filePath, user_id: id });

    return response.status(200).json();
  }
}

export { UploadAvatarController };
