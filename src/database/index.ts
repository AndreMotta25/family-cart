import 'dotenv/config';
import { DataSource, DataSourceOptions } from 'typeorm';
import { SeederOptions } from 'typeorm-extension';

const options: DataSourceOptions & SeederOptions = {
  type: 'postgres',
  host: process.env.HOST,
  port: Number(process.env.PORT_DB),
  username: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
  entities: [
    './src/modules/users/entities/*.ts',
    './src/modules/list/entities/*.ts',
    './src/modules/shared/entities/*.ts',
    './src/modules/notify/entities/*.ts',
  ],
  migrations: ['./src/database/migrations/*.ts'],
  seeds: [],
};

const database = new DataSource(options);

export { database };
