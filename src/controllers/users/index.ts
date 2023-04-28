import express, { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Users from '../../models/users/index';
import { IUsers } from '../../models/users/index';
import moment from 'moment';
const router = express.Router();

// Register users
router.post('/auth/user/sign-up', async (req: Request, res: Response) => {
    const { info, security } = req.body;
    const { firstName, surName, email } = info;
    const { password, confirmPassword } = security;

    // create password
    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);

    // Date Brazil
    const data = new Date();
    const now = new Date(data.getTime() - (3 * 60 * 60 * 1000));

    if (!firstName) {
        return res.status(400).send('O nome é obrigatorio!');
    }
    if (!surName) {
        return res.status(400).send('O sobrenome é obrigatorio!');
    }
    if (!email) {
        return res.status(400).send('O email é obrigatorio!');
    }
    if (!password) {
        return res.status(422).json({ error: 'A senha é obrigatória!' });
    }

    if (password !== confirmPassword) {
        return res.status(422).json({ error: 'As senhas não conferem!' });
    }
    // check if email exists
    const emailExists = await Users.findOne({ 'info.email': email });
    if (emailExists) {
        return res.status(422).json({ error: 'E-mail já cadastrado!' });
    }
    const user = {
        info: {
            firstName,
            surName,
            email
        },
        security: {
            password: passwordHash,
            accountCreateDate: now
        }
    };
    try {
        await Users.create(user);
        res.status(201).json({
            message: 'Usuario cadastrado com sucesso!',
            user,
        });
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ error: error });
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
    const { firstName, surName, email, dateOfBirth, phone } = info;
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