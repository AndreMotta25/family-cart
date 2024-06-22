import 'dotenv/config';
import { DataSource, DataSourceOptions } from 'typeorm';
import { SeederOptions } from 'typeorm-extension';

let extension = 'ts';

if (process.env.NODE_ENV?.toLowerCase() === 'production') extension = 'js';

const options: DataSourceOptions & SeederOptions = {
  type: 'postgres',
  host: process.env.HOST,
  port: Number(process.env.PORT_DB),
  username: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
  entities: [
    `./src/modules/users/entities/*.${extension}`,
    `./src/modules/list/entities/*.${extension}`,
    `./src/modules/shared/entities/*.${extension}`,
    `./src/modules/notify/entities/*.${extension}`,
  ],
  migrations: ['./src/database/migrations/*.ts'],
  seeds: [],
};

const database = new DataSource(options);

export { database };
