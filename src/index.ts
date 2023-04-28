import connectDatabase from './database/index'
import express, { Application } from 'express';
import dotenv from 'dotenv';
import corsMiddleware from './middlewares/index';
import routes from './routes/index';

dotenv.config();
const app = express();
declare const Date: any;

app.use(express.json());
//Cors
app.use(corsMiddleware());
//Conect database
connectDatabase(app);
//Routes
routes(app);

export default app;

