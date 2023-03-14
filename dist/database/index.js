"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const port = parseInt(process.env.PORT || '3000', 10);
console.log('Conectando ao Earth-Community...');
const connectDatabase = (app) => {
    mongoose_1.default.set('strictQuery', true);
    mongoose_1.default.connect(process.env.MONGODB_URI)
        .then(() => {
        console.log('Conectado ao Earth-Community!');
        app.listen(port, () => {
            console.log(`Servidor iniciado na porta ${port}`);
        });
    })
        .catch((err) => {
        console.error('Erro ao conectar com o banco de dados:', err);
        process.exit(1);
    });
};
exports.default = connectDatabase;
//# sourceMappingURL=index.js.map