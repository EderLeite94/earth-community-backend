import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import Users, { IUsers } from '../../models/users/index';

const signUpSchema = Joi.object({
    info: Joi.object({
        firstName: Joi.string().required().messages({ 'any.required': 'O nome é obrigatório' }),
        surname: Joi.string().required().messages({ 'any.required': 'O sobrenome é obrigatório' }),
        email: Joi.string().email().required().messages({ 'any.required': 'O email é obrigatório' }),
    }),
    security: Joi.object({
        authWith: Joi.string().valid('google', 'facebook', 'manually').required(),
        password: Joi.string().required().messages({ 'any.required': 'A senha é obrigatória' }),
        confirmPassword: Joi.string()
            .valid(Joi.ref('password'))
            .required()
            .messages({ 'any.required': 'As senhas não conferem' }),
    }),
}).options({ abortEarly: false });

const validateSignUp = async (req: Request, res: Response, next: NextFunction) => {
    try {
        await signUpSchema.validateAsync(req.body);
        console.log(req.body);
        // Verificar se o e-mail já está cadastrado
        const { email } = req.body;
        const emailExists = await Users.findOne({ 'info.email': email });
        if (emailExists) {
            return res.status(422).json({ error: 'E-mail já cadastrado!' });
        }
        next();
    } catch (error: any) {
        console.error('Error validating sign-up:', error);
        const errorMessage = error.message || 'Erro na validação do cadastro';
        res.status(400).json({ error: errorMessage });
    }
};
export { validateSignUp, signUpSchema };