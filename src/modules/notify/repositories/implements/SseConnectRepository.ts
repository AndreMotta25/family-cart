import { Response } from 'express';

import { IClient, ISseConnectRepository } from '../ISseConnectRepository';

interface ITestes {
  id: string;
  response: Response;
}
class SseConnectRepository implements ISseConnectRepository {
  private repositoryInMemory: ITestes[];

  constructor() {
    this.repositoryInMemory = [];
  }
  async getResponsesByIds(ids: string[]): Promise<Response[]> {
    const responses: Response[] = [];
    ids.forEach((e) => {
      const r = this.repositoryInMemory.find((r) => r.id === e);
      if (r) {
        responses.push(r.response);
      }
    });

    return responses;
  }

  async add({ id, response }: IClient): Promise<void> {
    this.repositoryInMemory.push({ id, response });
  }
  async getResponseById(id: string): Promise<Response | null> {
    const response = this.repositoryInMemory.find((r) => r.id === id);
    return response?.response ?? null;
  }
  async disconnect(id: string): Promise<void> {
    const newResponses = this.repositoryInMemory.filter((r) => r.id !== id);
    this.repositoryInMemory = newResponses;
  }
}

export { SseConnectRepository };
