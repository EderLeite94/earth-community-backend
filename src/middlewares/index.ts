import cors from 'cors';
import { RequestHandler } from 'express';

function corsMiddleware(): RequestHandler {
  const allowedOrigins = ['http://localhost:3000', process.env.ORIGIN_CLOUD];
  const corsOptions = {
    origin: allowedOrigins,
    methods: ['GET'],
    allowedHeaders: ['*'],
  };
  return cors();
}
export default corsMiddleware;