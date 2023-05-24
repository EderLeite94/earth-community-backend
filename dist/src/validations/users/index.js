"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateSignUp = void 0;
const joi_1 = __importDefault(require("joi"));
const index_1 = __importDefault(require("../../models/users/index"));
const signUpSchema = joi_1.default.object({
    firstName: joi_1.default.string().required().error(new Error('O nome é obrigatório')),
    surname: joi_1.default.string().required().error(new Error('O sobrenome é obrigatório')),
    email: joi_1.default.string().email().required().error(new Error('O email é obrigatório')),
    password: joi_1.default.string().required().error(new Error('A senha é obrigatória')),
    authWith: joi_1.default.string().valid('google', 'facebook', 'manually').required(),
    confirmPassword: joi_1.default.string().valid(joi_1.default.ref('password')).required().error(new Error('As senhas não conferem'))
}).options({ abortEarly: false });
const validateSignUp = async (req, res, next) => {
    try {
        await signUpSchema.validateAsync(req.body);
        // Verificar se o e-mail já está cadastrado
        const { email } = req.body;
        const emailExists = await index_1.default.findOne({ 'info.email': email });
        if (emailExists) {
            return res.status(422).json({ error: 'E-mail já cadastrado!' });
        }
        next();
    }
    catch (error) {
        res.status(400).json({ error: error });
    }
};
exports.validateSignUp = validateSignUp;
//# sourceMappingURL=index.js.map