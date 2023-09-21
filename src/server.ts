import 'express-async-errors';
import 'reflect-metadata';
import 'dotenv/config';
import './database';
import './shared/container';

import cors from 'cors';
import express, { json, NextFunction, Request, Response } from 'express';

import { AppError } from '@errors/AppError';

import { routes } from './routes';

const app = express();

app.use(json());
app.use(cors());

app.use(routes);

app.use(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  (err: Error, request: Request, response: Response, next: NextFunction) => {
    console.log(err);

    if (err instanceof AppError) {
      return response.status(err.statusCode).json({ message: err.message });
    }

    return response.status(500).json({ message: err.message });
  },
);

app.listen(process.env.PORT, () => {
  console.log('Server is Running');
});
