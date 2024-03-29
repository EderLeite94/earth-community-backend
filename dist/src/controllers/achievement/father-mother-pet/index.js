"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pets = void 0;
const group_1 = __importDefault(require("../../../models/group"));
async function Pets(id) {
    try {
        const users = await group_1.default.findOne({ 'members.user._id': id });
        const userCount = await group_1.default.countDocuments({
            'members.user._id': id,
            'category': 'Proteção Animal'
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
exports.Pets = Pets;
//# sourceMappingURL=index.js.map