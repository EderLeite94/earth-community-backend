import Joi from 'joi';

const signUpSchema = Joi.object({
    firstName: Joi.string().required().error(new Error('O nome é obrigatório')),
    surname: Joi.string().required().error(new Error('O sobrenome é obrigatório')),
    email: Joi.string().email().required().error(new Error('O email é obrigatório')),
    password: Joi.string().required().error(new Error('A senha é obrigatória')),
    confirmPassword: Joi.string().valid(Joi.ref('password')).required().error(new Error('As senhas não conferem'))
});
export default signUpSchema;
