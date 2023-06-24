"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Environment = void 0;
const group_1 = __importDefault(require("../../../models/group"));
async function Environment(id) {
    try {
        const users = await group_1.default.findOne({ 'members.user._id': id });
        const userCount = await group_1.default.countDocuments({
            'members.user._id': id,
            'category': 'Meio Ambiente'
        });
        if (userCount >= 1) {
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
exports.Environment = Environment;
//# sourceMappingURL=index.js.map