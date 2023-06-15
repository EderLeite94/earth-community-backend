"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.firstPass = void 0;
const index_1 = __importDefault(require("../../../models/users/index"));
async function firstPass(id) {
    try {
        const user = await index_1.default.findOne({ _id: id });
        if (user) {
            return { completed: true };
        }
        else {
            return { completed: false };
        }
    }
    catch (error) {
        throw error;
    }
}
exports.firstPass = firstPass;
//# sourceMappingURL=index.js.map