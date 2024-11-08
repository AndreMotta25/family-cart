import 'dotenv/config';
import { DataSource, DataSourceOptions } from 'typeorm';
import { SeederOptions } from 'typeorm-extension';

let extension = 'ts';

if (process.env.NODE_ENV?.toLowerCase() === 'production') extension = 'js';
console.log(extension);
const options: DataSourceOptions & SeederOptions = {
  type: 'postgres',
  // host: process.env.HOST,
  // port: Number(process.env.PORT_DB),
  // username: process.env.USER,
  // password: process.env.PASSWORD,
  // database: process.env.DATABASE,
  url: 'postgresql://postgres.ikxaojmvahbzvslllafp:Desenhos12@@aws-0-us-west-1.pooler.supabase.com:6543/postgres',
  entities: [
    `./src/modules/users/entities/*.${extension}`,
    `./src/modules/list/entities/*.${extension}`,
    `./src/modules/shared/entities/*.${extension}`,
    `./src/modules/notify/entities/*.${extension}`,
  ],
  migrations: [`./src/database/migrations/*.${extension}`],
  seeds: [],
};

const database = new DataSource(options);

export { database };
