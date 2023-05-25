import express, { Request, Response, NextFunction } from 'express';
import Users, { IUsers } from '../../models/users/index';
import bcrypt from 'bcrypt';
import moment from 'moment';
import jwt from 'jsonwebtoken';
import { validateSignUp, validateSignIn } from '../../validations/users/index';
import Group from '../../models/group';
const router = express.Router();
//register
router.post('/auth/user/sign-up', validateSignUp, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { info, security } = req.body;
    const { firstName, surname, email } = info;
    const { authWith, password, confirmPassword } = security;

    // Create password hash
    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);

    // Get current date/time in Brazil timezone
    const data = new Date();
    const now = new Date(data.getTime() - (3 * 60 * 60 * 1000));

    const User = {
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
    await Users.create(User);
    const user = await Users.findOne({ 'info.email': email });
    // console.log('User created:', user); // Log the created user
    res.status(201).json({
      message: 'Usuário cadastrado com sucesso!',
      user,
    });
  } catch (error) {
    // console.error('Error creating user:', error);
    return res.status(500).json({ error: 'Erro ao criar usuário' });
  }
});

//Login users
router.post('/auth/user/sign-in', validateSignIn, async (req: Request, res: Response) => {
  const { info, security } = req.body;
  const { email } = info;
  const { password } = security;
  try {
    const user: IUsers | null = await Users.findOne({ 'info.email': email });
    if (!user) {
      return res.status(404).json({ error: 'Usuário não cadastrado!' });
    }
    // Fetch group information based on groupIds
    const groups = await Group.find({ _id: { $in: user.groupIds } });

    const secret: string | undefined = process.env.SECRET;

    const token: string = jwt.sign(
      {
        id: user.info._id,
      },
      secret || ''
    );

    res.status(200).json({
      message: 'Usuário logado com sucesso',
      token,
      user,
      groups
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Aconteceu um erro no servidor, tente novamente mais tarde!' });
  }
});
// Update - User
router.patch('/user/update-by-id/:id', async (req: Request, res: Response) => {
  moment.locale('pt-BR');
  const id: string = req.params.id;
  const { info, address } = req.body;
  const { firstName, surname, email, dateOfBirth, pictureProfile, phone } = info;
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