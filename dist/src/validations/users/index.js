"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signUpSchema = exports.validateSignUp = void 0;
const joi_1 = __importDefault(require("joi"));
const index_1 = __importDefault(require("../../models/users/index"));
const signUpSchema = joi_1.default.object({
    info: joi_1.default.object({
        firstName: joi_1.default.string().required().error(new Error('O nome é obrigatório')),
        surname: joi_1.default.string().required().error(new Error('O sobrenome é obrigatório')),
        email: joi_1.default.string().email().required().error(new Error('O email é obrigatório')),
    }),
    security: joi_1.default.object({
        authWith: joi_1.default.string().valid('google', 'facebook', 'manually').required(),
        password: joi_1.default.string().required().error(new Error('A senha é obrigatória')),
        confirmPassword: joi_1.default.string()
            .valid(joi_1.default.ref('password'))
            .required()
            .error(new Error('As senhas não conferem')),
    }),
}).options({ abortEarly: false });
exports.signUpSchema = signUpSchema;
const validateSignUp = async (req, res, next) => {
    try {
        await signUpSchema.validateAsync(req.body);
        console.log(req.body);
        // Verificar se o e-mail já está cadastrado
        const { email } = req.body;
        const userExist = await index_1.default.findOne({ 'info.email': email });
        if (userExist) {
            return res.status(422).json({ error: 'E-mail já cadastrado!' });
        }
        next();
    }
    catch (error) {
        console.error('Error validating sign-up:', error);
        const errorMessage = error.message || 'Erro na validação do cadastro';
        res.status(400).json({ error: errorMessage });
    }
};
exports.validateSignUp = validateSignUp;
//# sourceMappingURL=index.js.map