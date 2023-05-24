import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import Users, { IUsers } from '../../models/users/index';

const signUpSchema = Joi.object({
    firstName: Joi.string().required().error(new Error('O nome é obrigatório')),
    surname: Joi.string().required().error(new Error('O sobrenome é obrigatório')),
    email: Joi.string().email().required().error(new Error('O email é obrigatório')),
    password: Joi.string().required().error(new Error('A senha é obrigatória')),
    authWith: Joi.string().valid('google', 'facebook', 'manually').required(),
    confirmPassword: Joi.string().valid(Joi.ref('password')).required().error(new Error('As senhas não conferem'))
}).options({ abortEarly: false });

const validateSignUp = async (req: Request, res: Response, next: NextFunction) => {
    try {
        await signUpSchema.validateAsync(req.body);
        // Verificar se o e-mail já está cadastrado
        const { email } = req.body;
        const emailExists = await Users.findOne({ 'info.email': email });
        if (emailExists) {
            return res.status(422).json({ error: 'E-mail já cadastrado!' });
        }
        next();
    } catch (error) {
        res.status(400).json({ error: error });
    }
};
export { validateSignUp };
