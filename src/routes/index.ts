import userRoutes from '../controllers/users/index';
import postRoutes from '../controllers/feed/index';
import groupRoutes from '../controllers/group/index';
import express, { Application, Express } from 'express';
import path from 'path';
const app: Application = express();

export default function (app: Express) {
    app.use('/api', userRoutes);
    app.use('/api', postRoutes);
    app.use('/api', groupRoutes);

}
