import { Response } from 'express';
import { inject, injectable } from 'tsyringe';

import { ISseConnectRepository } from '@modules/notify/repositories/ISseConnectRepository';

interface IRequestRealTimeNotification {
  userId: string;
  response: Response;
}

@injectable()
class RealTimeNotificationUseCase {
  constructor(
    @inject('SseRepository') private sseRepository: ISseConnectRepository,
  ) {}

  async execute({ userId, response }: IRequestRealTimeNotification) {
    await this.sseRepository.add({ id: userId, response });
  }
  async removeUser(userId: string) {
    await this.sseRepository.disconnect(userId);
  }
}

export { RealTimeNotificationUseCase };
