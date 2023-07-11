"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
function corsMiddleware() {
    const allowedOrigins = ['https://www.earthcommunity.com.br', 'https://example.com'];
    const corsOptions = {
        origin: allowedOrigins,
        methods: ['GET, PUT, POST, DELETE, PATCH'],
        allowedHeaders: ['Content-Type', 'Authorization'],
    };
    return (0, cors_1.default)(corsOptions);
}
exports.default = corsMiddleware;
//# sourceMappingURL=index.js.map