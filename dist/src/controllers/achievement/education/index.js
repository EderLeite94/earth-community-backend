"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Education = void 0;
const group_1 = __importDefault(require("../../../models/group"));
async function Education(id) {
    try {
        const users = await group_1.default.findOne({ 'members.user._id': id });
        const userCount = await group_1.default.countDocuments({
            'members.user._id': id,
            'category': 'Educação'
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
exports.Education = Education;
//# sourceMappingURL=index.js.map