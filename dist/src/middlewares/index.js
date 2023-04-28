"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
function corsMiddleware() {
    const allowedOrigins = ['http://localhost:3000', process.env.ORIGIN_CLOUD];
    const corsOptions = {
        origin: allowedOrigins,
        methods: ['*'],
        allowedHeaders: ['*'],
    };
    return (0, cors_1.default)();
}
exports.default = corsMiddleware;
//# sourceMappingURL=index.js.map