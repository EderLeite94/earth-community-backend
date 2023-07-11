import cors from 'cors';
import { RequestHandler } from 'express';

function corsMiddleware(): RequestHandler {
  const allowedOrigins = ['https://www.earthcommunity.com.br', 'https://example.com'];
  const corsOptions = {
    origin: allowedOrigins,
    methods: ['GET, PUT, POST, DELETE, PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  };
  return cors(corsOptions);
}

export default corsMiddleware;