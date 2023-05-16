import express, { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Users from '../../models/users/index';
import { IUsers } from '../../models/users/index';
import moment from 'moment';
import Joi from 'joi';
import signUpSchema from '../../validations/users/index';
const router = express.Router();

router.post('/auth/user/sign-up', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { info, security } = req.body;
        const { firstName, surname, email } = info;
        const { authWith, password, confirmPassword } = security;
        // Validate input data
        await signUpSchema.validateAsync({ ...info, ...security }, { abortEarly: false });
        // Create password hash
        const salt = await bcrypt.genSalt(12);
        const passwordHash = await bcrypt.hash(password, salt);
        // Get current date/time in Brazil timezone
        const data = new Date();
        const now = new Date(data.getTime() - (3 * 60 * 60 * 1000));
        //check if email exists
        const emailExists = await Users.findOne({ 'info.email': email });
        if (emailExists) {
            return res.status(422).json({ error: 'E-mail já cadastrado!' });
        }
        const user = {
            info: {
                firstName,
                surname,
                email
            },
            security: {
                authWith,
                password: passwordHash,
                accountCreateDate: now
            }
        };
        // Insert user in database
        await Users.create(user);
        res.status(201).json({
            message: 'Usuário cadastrado com sucesso!',
            user,
        });
    } catch (error) {
        if (error instanceof Joi.ValidationError) {
            const errors = error.details.map((err) => err.message);
            return res.status(422).json({ error: errors });
        } else {
            console.error('Error creating user:', error);
            return res.status(500).json({ error: (error as Error).message });
        }
    }
});

//Login users
router.post('/auth/user/sign-in', async (req: Request, res: Response) => {
    const { info, security } = req.body;
    const { email } = info;
    const { password } = security

    if (!email) {
        return res.status(422).json({ message: 'O e-mail é obrigatório!' })
    }
    //check if user exists
    const user: IUsers | null = await Users.findOne({ 'info.email': email });
    if (!user) {
        return res.status(404).json({ message: 'Usuário não cadastrado!' })
    }
    // check if password match
    const checkPassword: boolean = await bcrypt.compare(password, user.security.password)
    if (!checkPassword) {
        return res.status(422).json({ message: 'Senha invalida!' })
    }
    try {
        const secret: string | undefined = process.env.SECRET;
        const token: string = jwt.sign({
            id: user.info._id,
        },
            secret || '',
        );
        res.status(200).json({
            message: 'Usuário logado com sucesso',
            token,
            user
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Aconteceu um erro no servidor, tente novamente mais tarde!' });
    }
});
// Update - User
router.patch('/user/update-by-id/:id', async (req: Request, res: Response) => {
    moment.locale('pt-BR');
    const id: string = req.params.id;
    const { info, address } = req.body;
    const { firstName, surname, email, dateOfBirth, phone } = info;
    const isoDate = moment(dateOfBirth, 'DD/MM/YYYY', true).toDate();
    info.dateOfBirth = isoDate;
    const { city, state } = address
    try {
        const updateUser = await Users.updateOne({ _id: id }, req.body);
        if (updateUser.matchedCount === 0) {
            res.status(422).json({ message: 'Usuário não encontrado' })
        }
        res.status(200).json({ message: 'Dados atualizados com sucesso!' })
    } catch (error) {
        res.status(500).json({ error: error });
    }
});
export default router