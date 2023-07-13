"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const corsMiddleware = (req, res, next) => {
    const allowedOrigins = [
        process.env.ORIGIN_CLOUD,
        `http://localhost:3000`, // Localhost na porta 3000
    ].filter(Boolean);
    const corsOptions = {
        origin: allowedOrigins,
        methods: ['GET', 'PUT', 'POST', 'DELETE', 'PATCH'],
        allowedHeaders: ['Content-Type', 'Authorization'],
    };
    // Verifica se o User-Agent é do Postman
    // const isPostman = req.get('User-Agent')?.includes('Postman');
    // if (isPostman) {
    //   return res.status(403).json({ error: 'Requisições do Postman são bloqueadas.' });
    // }
    (0, cors_1.default)(corsOptions)(req, res, next);
};
exports.default = corsMiddleware;
//# sourceMappingURL=index.js.map