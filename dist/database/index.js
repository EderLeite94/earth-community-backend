"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const port = parseInt(process.env.PORT || '3000');
const URL = process.env.MONGODB_URI;
const connectDatabase = () => {
    console.info(`Aplicação rodando na porta ${port}`);
    console.log('Conectando ao banco de dados, aguarde!');
    mongoose_1.default.set('strictQuery', true);
    return mongoose_1.default.connect(`${URL}`)
        .then(() => {
        console.log('Conectado ao Earth - Community');
    })
        .catch((err) => console.log(err));
};
exports.default = connectDatabase;
//# sourceMappingURL=index.js.map