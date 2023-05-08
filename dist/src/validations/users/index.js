"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const signUpSchema = joi_1.default.object({
    firstName: joi_1.default.string().required().error(new Error('O nome é obrigatório')),
    surname: joi_1.default.string().required().error(new Error('O sobrenome é obrigatório')),
    email: joi_1.default.string().email().required().error(new Error('O email é obrigatório')),
    password: joi_1.default.string().required().error(new Error('A senha é obrigatória')),
    confirmPassword: joi_1.default.string().valid(joi_1.default.ref('password')).required().error(new Error('As senhas não conferem'))
});
exports.default = signUpSchema;
//# sourceMappingURL=index.js.map