import { DataSource } from 'typeorm';

const database = new DataSource({
    type:'postgres',
    host: process.env.HOST,
    port: Number(process.env.PORT_DB),
    username: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE
}) 

export {database}