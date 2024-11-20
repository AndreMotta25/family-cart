import 'dotenv/config';
import { DataSource, DataSourceOptions } from 'typeorm';
import { SeederOptions } from 'typeorm-extension';

let extension = 'ts';
if (process.env.NODE_ENV?.toLowerCase() === 'production') extension = 'js';

const options: DataSourceOptions & SeederOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 8888,
  username: 'docker',
  password: 'docker',
  database: 'familyCart',
  // url: 'postgresql://postgres.ikxaojmvahbzvslllafp:Desenhos12@@aws-0-us-west-1.pooler.supabase.com:6543/postgres',
  entities: [
    /*
      Quando compilarmos, a pasta dist também tem que estar na url.
      => `./dist/src/modules/users/entities/*.${extension}`, 
      Se deixarmos somente o src, o vscode vai assimilar que é o src da pasta em que está o codigo ts e não o que está em dist.

      Outra saida seria usar o __dirname.
      
      Mas veja bem, temos que olhar dentro da pasta entities porque é nela que estão as entidades. Se olharmos em modules como 
      um todo, vamos ter um erro chato porque vai enxergar os testes também, por isso o erro do describe antes. 
      */
    // `${__dirname}/../modules/**/entities/*.${extension}`

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
