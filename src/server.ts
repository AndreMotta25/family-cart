import 'reflect-metadata'
import 'dotenv/config';
import './database'

import express, {json} from 'express'
import cors from 'cors';


const app = express();

app.use(json());
app.use(cors());


app.listen(process.env.PORT, () => {
    console.log('Server is Running')
})