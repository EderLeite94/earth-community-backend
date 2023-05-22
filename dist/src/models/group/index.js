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
const GroupSchema = new mongoose_1.Schema({
    name: { type: String },
    image: { type: String },
    description: { type: String },
    category: { type: String },
    headOffice: {
        city: { type: String },
        state: { type: String },
    },
    memberIds: (Array),
    createdByUser: {
        info: {
            firstName: { type: String, required: true },
            surname: { type: String, required: true },
            email: { type: String, required: true, unique: true },
            dateOfBirth: { type: Date },
            phone: { type: String },
        },
        security: {
            authWith: { type: String, enum: ['google', 'facebook', 'manually'] },
            password: { type: String },
            accountCreateDate: { type: Date },
        },
        address: {
            city: { type: String },
            state: { type: String },
        },
        groupIds: [{ type: String }],
        donationIds: [{ type: Number }],
    },
    createdAt: { type: Date },
});
const Group = mongoose_1.default.model('Group', GroupSchema);
exports.default = Group;
//# sourceMappingURL=index.js.map