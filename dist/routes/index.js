"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = __importDefault(require("../controllers/users/index"));
const index_2 = __importDefault(require("../controllers/feed/index"));
const index_3 = __importDefault(require("../controllers/group/index"));
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
function default_1(app) {
    app.use('/api', index_1.default);
    app.use('/api', index_2.default);
    app.use('/api', index_3.default);
    app.use('/', swaggerUi.serve);
    app.get('/', swaggerUi.setup(swaggerDocument));
}
exports.default = default_1;
//# sourceMappingURL=index.js.map