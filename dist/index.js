"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = __importDefault(require("./database/index"));
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const index_2 = __importDefault(require("./middlewares/index"));
const index_3 = __importDefault(require("./routes/index"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
//Cors
app.use((0, index_2.default)());
//Conect database
(0, index_1.default)(app);
//Routes
(0, index_3.default)(app);
//# sourceMappingURL=index.js.map