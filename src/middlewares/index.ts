import cors, { CorsOptions } from 'cors';
import { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';

dotenv.config();

const corsMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const allowedOrigins: (string | undefined)[] = [
    process.env.ORIGIN_CLOUD, // Valor do ALLOWED_ORIGIN1 no arquivo .env
    `http://localhost:3000`, // Localhost na porta 3000
  ].filter(Boolean);

  const corsOptions: CorsOptions = {
    origin: allowedOrigins as (string | RegExp | boolean)[],
    methods: ['GET', 'PUT', 'POST', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  };

  // Verifica se o User-Agent é do Postman
  const isPostman = req.get('User-Agent')?.includes('Postman');

  if (isPostman) {
    return res.status(403).json({ error: 'Requisições do Postman são bloqueadas.' });
  }

  cors(corsOptions)(req, res, next);
};

export default corsMiddleware;
