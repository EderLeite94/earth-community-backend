import cors from 'cors';
import { RequestHandler } from 'express';

function corsMiddleware(): RequestHandler {
  const allowedOrigins = ['Access-Control-Allow-Origin', process.env.ORIGIN_CLOUD];
  const corsOptions = {
    origin: allowedOrigins,
    methods: ['POST'],
    allowedHeaders: ['Access-Control-Allow-Methods','GET, PUT, POST, DELETE, PATCH'],
  };
  return cors();
}
export default corsMiddleware;