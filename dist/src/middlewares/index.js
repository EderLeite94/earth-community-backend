"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const corsMiddleware = (req, res, next) => {
    const allowedOrigins = ['https://www.earthcommunity.com.br'];
    const corsOptions = {
        origin: allowedOrigins,
        methods: ['GET', 'PUT', 'POST', 'DELETE', 'PATCH'],
        allowedHeaders: ['Content-Type', 'Authorization'],
    };
    (0, cors_1.default)(corsOptions)(req, res, next); // Added parentheses to invoke the cors function with the correct parameters
};
exports.default = corsMiddleware;
//# sourceMappingURL=index.js.map