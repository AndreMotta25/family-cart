import { database } from './database/index';

database
  .initialize()
  .then(() => {
    console.log('Database is Runnig');
  })
  .catch(() => {
    console.log('Database Error');
  });
