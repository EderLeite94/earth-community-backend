import express, { Request, Response, NextFunction } from 'express';
import Users, { IUsers } from '../../models/users/index';
import { generateUniqueNickname } from '../../utils/nickname/index';
import { validateSignUp, validateSignIn } from '../../validations/users/index';
import { now } from '../../utils/date';
import bcrypt from 'bcrypt';
import corsMiddleware from '../../middlewares';
import jwt from 'jsonwebtoken';
import Group from '../../models/group';
import Post from '../../models/feed';
import mongoose from 'mongoose';
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

    // Generate a unique nickname
    const nickname = await generateUniqueNickname(firstName, surname);

    const users = {
      info: {
        firstName,
        surname,
        email,
        nickName: nickname,
      },
      security: {
        authWith,
        password: passwordHash,
        accountCreateDate: now
      }
    };
    // Insert user in database
    await Users.create(users);
    const user: IUsers | null = await Users.findOne({ 'info.email': email });
    res.status(201).json({
      message: 'Usuário cadastrado com sucesso!',
      user
    });
  } catch (error) {
    console.error('Error creating user:', error);
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
      message: 'Usuário autenticado!',
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
  const id: string = req.params.id;
  const { info, address } = req.body;
  const { nickName, firstName, surname, email, about, dateOfBirth, pictureProfile, phone } = info;
  const { city, state } = address;

  try {
    const updateUser = await Users.updateOne({ _id: id }, req.body);
    const member = await Group.updateOne({ 'members.user._id': id }, { $set: { 'members.$.user.info': info, 'members.$.user.address': address } });
    const createduser = await Group.updateOne({ 'createdByUser.user._id': id }, { $set: { 'createdByUser.user.info': info, 'createdByUser.user.address': address } });
    const postuser = await Post.updateOne({ 'createdByUser.user._id': id }, { $set: { 'createdByUser.user.info': info, 'createdByUser.user.address': address } });
    const user = await Users.findById(id);
    if (!user) {
      return res.status(422).json({ error: 'Usuário não encontrado' });
    }
    const updatedPosts = await Post.updateMany(
      { 'comments.user._id': new mongoose.Types.ObjectId(id) },
      {
        $set: {
          'comments.$[elem].user.info.nickName': nickName,
          'comments.$[elem].user.info.firstName': firstName,
          'comments.$[elem].user.info.surname': surname,
          'comments.$[elem].user.info.email': email,
          'comments.$[elem].user.info.about': about,
          'comments.$[elem].user.info.dateOfBirth': dateOfBirth,
          'comments.$[elem].user.info.pictureProfile': pictureProfile,
          'comments.$[elem].user.info.phone': phone,
          'comments.$[elem].user.address.city': city,
          'comments.$[elem].user.address.state': state,
        }
      },
      { arrayFilters: [{ 'elem.user._id': new mongoose.Types.ObjectId(id) }] }
    );


    return res.status(200).json({
      message: 'Dados atualizados com sucesso!',
      user,
      updatedPosts
    });
  } catch (error) {
    return res.status(500).json({ error: error });
  }
});
router.get('/user/get-by-nickname/:nickName', async (req: Request, res: Response) => {
  const { nickName } = req.params;
  try {
    const user = await Users.findOne({ 'info.nickName': nickName });
    if (!user) {
      return res.status(404).json({ error: 'Nick não encontrado' });
    }

    res.status(200).json({
      user
    });
  } catch (error) {
    console.error('Error adding member:', error);
    res.status(500).json({ error: error });
  }
});
export default router