import { database } from './database/index';

database
  .initialize()
  .then(() => {
    console.log('Database is Runnig');
  })
  .catch((e) => {
    console.log(e);
    console.log('Database Error');
  });
