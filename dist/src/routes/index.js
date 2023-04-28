"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = __importDefault(require("../controllers/users/index"));
const index_2 = __importDefault(require("../controllers/feed/index"));
const index_3 = __importDefault(require("../controllers/group/index"));
const index_4 = __importDefault(require("../controllers/donate/index"));
const express_1 = __importDefault(require("express"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_json_1 = __importDefault(require("../../swagger.json"));
const app = (0, express_1.default)();
function default_1(app) {
    app.use('/api', index_1.default);
    app.use('/api', index_2.default);
    app.use('/api', index_3.default);
    app.use('/api', index_4.default);
    app.use('/', swagger_ui_express_1.default.serve);
    app.get('/', swagger_ui_express_1.default.setup(swagger_json_1.default));
}
exports.default = default_1;
//# sourceMappingURL=index.js.map