"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = __importDefault(require("../controllers/users/index"));
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
function default_1(app) {
    app.use('/api', index_1.default);
}
exports.default = default_1;
//# sourceMappingURL=index.js.map