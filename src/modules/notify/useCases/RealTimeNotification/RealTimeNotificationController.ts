import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { RealTimeNotificationUseCase } from './RealTimeNotificationUseCase';

class RealTimeNotificationController {
  async handle(request: Request, response: Response) {
    const { id } = request.user;

    const headers = {
      'Content-Type': 'text/event-stream',
      Connection: 'keep-alive',
      'Cache-Control': 'no-cache',
    };

    response.writeHead(200, headers);
    // response.write('data: teste\n\n');
    const realTimeNotificationUseCase = container.resolve(
      RealTimeNotificationUseCase,
    );
    await realTimeNotificationUseCase.execute({ userId: id, response });

    request.on('close', async () => {
      await realTimeNotificationUseCase.removeUser(id);
    });
  }
}

export { RealTimeNotificationController };
