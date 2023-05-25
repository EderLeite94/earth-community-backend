"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateSignIn = exports.signInSchema = exports.signUpSchema = exports.validateSignUp = void 0;
const joi_1 = __importDefault(require("joi"));
const bcrypt_1 = __importDefault(require("bcrypt"));
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
const signInSchema = joi_1.default.object({
    info: joi_1.default.object({
        email: joi_1.default.string().email().required().error(new Error('O email é obrigatório')),
    }),
    security: joi_1.default.object({
        password: joi_1.default.string().required().error(new Error('A senha é obrigatória')),
    }),
});
exports.signInSchema = signInSchema;
const validateSignUp = async (req, res, next) => {
    try {
        await signUpSchema.validateAsync(req.body);
        console.log(req.body);
        // Verificar se o e-mail já está cadastrado
        const { email } = req.body.info;
        const emailExists = await index_1.default.findOne({ 'info.email': email });
        if (emailExists) {
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
const validateSignIn = async (req, res, next) => {
    try {
        await signInSchema.validateAsync(req.body);
        console.log(req.body);
        const { email } = req.body.info;
        const { password } = req.body.security;
        // if (!email) {
        //     return res.status(422).json({ error: 'O e-mail é obrigatório!' });
        // }
        // if (!password) {
        //     return res.status(422).json({ error: 'O e-mail é obrigatório!' });
        // }
        // Check if user exists
        const user = await index_1.default.findOne({ 'info.email': email });
        if (!user) {
            return res.status(404).json({ error: 'Usuário não cadastrado!' });
        }
        // Check if password matches
        const checkPassword = await bcrypt_1.default.compare(password, user.security.password);
        if (!checkPassword) {
            return res.status(422).json({ message: 'Senha inválida!' });
        }
        // Fetch group information based on groupIds
        next();
    }
    catch (error) {
        console.error('Error validating sign-in:', error);
        const errorMessage = error.message || 'Erro na validação do usuário';
        res.status(400).json({ error: errorMessage });
    }
};
exports.validateSignIn = validateSignIn;
//# sourceMappingURL=index.js.map