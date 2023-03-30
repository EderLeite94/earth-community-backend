import userRoutes from '../controllers/users/index';
import postRoutes from '../controllers/feed/index'
import express, { Application, Express } from 'express';
const app: Application = express();

export default function (app: Express) {
    app.use('/api', userRoutes)
    app.use('/api', postRoutes)

}
