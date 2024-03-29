"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const UsersSchema = new mongoose_1.Schema({
    info: {
        nickName: { type: String, unique: true },
        firstName: { type: String, required: true },
        surname: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        about: { type: String, default: null },
        dateOfBirth: { type: Date, default: null },
        pictureProfile: { type: String, default: null },
        phone: { type: String, default: null },
    },
    security: {
        authWith: { type: String, enum: ['google', 'facebook', 'manually'] },
        password: { type: String },
        accountCreateDate: { type: Date },
    },
    address: {
        city: { type: String, default: null },
        state: { type: String, default: null },
    },
    groupIds: [{ type: String, default: [] }],
    donationIds: [{ type: Number, default: [] }],
});
const Users = mongoose_1.default.model('Users', UsersSchema);
exports.default = Users;
//# sourceMappingURL=index.js.map