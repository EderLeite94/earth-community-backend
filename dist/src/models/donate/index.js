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
const DonateSchema = new mongoose_1.Schema({
    transactionID: { type: Number },
    transaction_amount: { type: String },
    description: { type: String },
    payment_method_id: { type: String },
    donateCreateDate: { type: Date },
    payer: {
        user_id: { type: String },
        email: { type: String },
        first_name: { type: String },
        last_name: { type: String },
        identification: {
            type: { type: String },
            number: { type: Number },
        },
        address: {
            zip_code: { type: Number },
            street_name: { type: String },
            street_number: { type: String },
            neighborhood: { type: String },
            city: { type: String },
            federal_unit: { type: String }
        }
    }
});
const Donate = mongoose_1.default.model('Donate', DonateSchema);
exports.default = Donate;
//# sourceMappingURL=index.js.map