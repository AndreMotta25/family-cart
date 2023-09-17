import 'reflect-metadata';
import 'dotenv/config';
import './database';
import './shared/container';

import cors from 'cors';
import express, { json } from 'express';

import { routes } from './routes';

const app = express();

app.use(json());
app.use(cors());

app.use(routes);

app.listen(process.env.PORT, () => {
  console.log('Server is Running');
});
