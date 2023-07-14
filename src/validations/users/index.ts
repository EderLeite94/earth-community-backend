import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import bcrypt from 'bcrypt';
import Users, { IUsers } from '../../models/users/index';
import Group from '../../models/group';

const signUpSchema = Joi.object({
    info: Joi.object({
        firstName: Joi.string().required().error(new Error('O nome é obrigatório')),
        surname: Joi.string().required().error(new Error('O sobrenome é obrigatório')),
        email: Joi.string().email().required().error(new Error('O email é obrigatório')),
    }),
    security: Joi.object({
        authWith: Joi.string().valid('google', 'facebook', 'manually').required(),
        password: Joi.string().required().error(new Error('A senha é obrigatória')),
        confirmPassword: Joi.string()
            .valid(Joi.ref('password'))
            .required()
            .error(new Error('As senhas não conferem')),
    }),
}).options({ abortEarly: false });

const signInSchema = Joi.object({
    info: Joi.object({
        email: Joi.string().email().required().error(new Error('O email é obrigatório')),
    }),
    security: Joi.object({
        password: Joi.string().required().error(new Error('A senha é obrigatória')),
    }),
})

const validateSignUp = async (req: Request, res: Response, next: NextFunction) => {
    try {
        await signUpSchema.validateAsync(req.body);
        console.log(req.body);
        // Verificar se o e-mail já está cadastrado
        const { email } = req.body.info;
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


const validateSignIn = async (req: Request, res: Response, next: NextFunction) => {
    try {
        await signInSchema.validateAsync(req.body);
        console.log(req.body);
        const { email } = req.body.info;
        const { password } = req.body.security
        // if (!email) {
        //     return res.status(422).json({ error: 'O e-mail é obrigatório!' });
        // }
        // if (!password) {
        //     return res.status(422).json({ error: 'O e-mail é obrigatório!' });
        // }
        // Check if user exists
        const user: IUsers | null = await Users.findOne({ 'info.email': email });
        if (!user) {
            return res.status(404).json({ error: 'Usuário não cadastrado!' });
        }

        // Check if password matches
        const checkPassword: boolean = await bcrypt.compare(password, user.security.password);
        if (!checkPassword) {
            return res.status(422).json({ error: 'Usuário ou senha inválida!' });
        }

        // Fetch group information based on groupIds
        next();
    } catch (error: any) {
        console.error('Error validating sign-in:', error);
        const errorMessage = error.message || 'Erro na validação do usuário';
        res.status(400).json({ error: errorMessage });
    }
};
export { validateSignUp, signUpSchema, signInSchema, validateSignIn };