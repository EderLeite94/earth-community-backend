"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const corsMiddleware = (req, res, next) => {
    var _a;
    const allowedOrigins = ['https://www.earthcommunity.com.br'];
    const corsOptions = {
        origin: allowedOrigins,
        methods: ['GET', 'PUT', 'POST', 'DELETE', 'PATCH'],
        allowedHeaders: ['Content-Type', 'Authorization'],
    };
    // Verifica se o User-Agent é do Postman
    const isPostman = (_a = req.get('User-Agent')) === null || _a === void 0 ? void 0 : _a.includes('Postman');
    if (isPostman) {
        return res.status(403).json({ error: 'Requisições do Postman são bloqueadas.' });
    }
    (0, cors_1.default)(corsOptions)(req, res, next);
};
exports.default = corsMiddleware;
//# sourceMappingURL=index.js.map