import { Response } from 'express';

export interface IClient {
  id: string;
  response: Response;
}

interface ISseConnectRepository {
  add(client: IClient): Promise<void>;
  getResponseById(id: string): Promise<Response | null>;
  getResponsesByIds(ids: string[]): Promise<Response[]>;
  disconnect(id: string): Promise<void>;
}

export { ISseConnectRepository };
