import cors from 'cors';
import { Request, Response, NextFunction } from 'express';

const corsMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const allowedOrigins = ['https://www.earthcommunity.com.br'];
  const corsOptions = {
    origin: allowedOrigins,
    methods: ['GET', 'PUT', 'POST', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  };

  // Adicione esse cabeçalho para permitir o uso de credenciais (cookies, headers personalizados, etc)
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  cors(corsOptions)(req, res, next);
};

export default corsMiddleware;
