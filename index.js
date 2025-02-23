import express from 'express'
import cors from 'cors'
import { config } from 'dotenv'

import writeRouter from './routes/writeRoutes.js';
import utilRouter from './routes/utilRoutes.js';
import readRouter from './routes/readRoutes.js';
import homeRouter from './routes/homeRoute.js';

config();

const app = express();
const PORT = process.env.PORT || 5000;

//middleware
app.use(cors({
    origin:['http://localhost:5173','https://fvkry.vercel.app']
}));
app.use(express.json());

//routes
app.use('/api/write', writeRouter);
app.use('/api/utils', utilRouter);
app.use('/api/read', readRouter);
app.use('/', homeRouter);

app.listen(PORT, () => {
    console.log("Server Listening At Port ", PORT);
})