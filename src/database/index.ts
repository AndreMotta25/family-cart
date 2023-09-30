import 'dotenv/config';
import { DataSource } from 'typeorm';

const database = new DataSource({
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
  ],
  migrations: ['./src/database/migrations/*.ts'],
});

export { database };
