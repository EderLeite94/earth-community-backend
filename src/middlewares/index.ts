import cors from 'cors';
import { Request, Response, NextFunction } from 'express';

const corsMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const allowedOrigins = ['https://www.earthcommunity.com.br'];
  const corsOptions = {
    origin: allowedOrigins,
    methods: ['GET', 'PUT', 'POST', 'DELETE', 'PATCH'], // Removed the comma from the methods array
    allowedHeaders: ['Content-Type', 'Authorization'],
  };

  cors(corsOptions)(req, res, next); // Added parentheses to invoke the cors function with the correct parameters
};

export default corsMiddleware;
