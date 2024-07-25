import { inject, injectable } from 'tsyringe';

import { AppError } from '../../../../errors/AppError';
import { IPhotoProvider } from '../../providers/photoProvider/IPhotoProvider';
import { IUserRepository } from '../../repositories/IUserRepository';

interface IUploadAvatarRequest {
  file: string;
  user_id: string;
}

@injectable()
class UploadAvatarUseCase {
  constructor(
    @inject('PhotoProvider') private photoProvider: IPhotoProvider,
    @inject('UserRepository') private userRepository: IUserRepository,
  ) {}

  async execute({ file, user_id }: IUploadAvatarRequest): Promise<void> {
    const { cid, name: avatar } = await this.photoProvider.saveFile(file);

    const user = await this.userRepository.findById(user_id);

    if (!user) {
      throw new AppError({ message: 'User not found', statusCode: 404 });
    }

    const oldAvatar = user.avatar;

    if (oldAvatar) {
      this.photoProvider.deleteFile(oldAvatar);
    }

    user.avatar = avatar;
    user.cid = cid;

    await this.userRepository.create({
      ...user,
      login: user.login as 'external' | 'internal',
    });
  }
}

export { UploadAvatarUseCase };
