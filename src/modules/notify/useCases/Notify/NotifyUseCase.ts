import { inject, injectable } from 'tsyringe';

import { ISseConnectRepository } from '@modules/notify/repositories/ISseConnectRepository';

import { INotifyUseCase } from './INotifyUseCase';

@injectable()
class NotifyUseCase implements INotifyUseCase {
  constructor(
    @inject('SseRepository') private sseRepository: ISseConnectRepository,
  ) {}

  execute(id: string, message: string): Promise<void>;
  execute(ids: string[], message: string): Promise<void>;
  async execute(id: string | string[], message: string) {
    if (!Array.isArray(id)) {
      const response = await this.sseRepository.getResponseById(id);
      response?.write(`data: ${message}\n\n`);
    } else {
      const responses = await this.sseRepository.getResponsesByIds(id);
      responses.forEach((r) => {
        r.write(`data: ${message}\n\n`);
      });
    }
  }
}

export { NotifyUseCase };
