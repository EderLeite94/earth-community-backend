import userRoutes from '../controllers/users/index';
import postRoutes from '../controllers/feed/index';
import groupRoutes from '../controllers/group/index';
import donateRoutes from '../controllers/donate/index';
import achievementRoutes from '../controllers/achievement/index';
import express, { Application, Express } from 'express';
import swaggerUi from 'swagger-ui-express'
import swaggerDocument from '../../swagger.json';

const app: Application = express();

export default function (app: Express) {
    app.use('/api', userRoutes);
    app.use('/api', postRoutes);
    app.use('/api', groupRoutes);
    app.use('/api', donateRoutes);
    app.use('/api', achievementRoutes);
    app.use('/', swaggerUi.serve);
    app.get('/', swaggerUi.setup(swaggerDocument));
}
