import express, { Request, Response } from 'express';
import Group, { GroupsDocument } from '../../models/group/index';
import { now } from '../../utils/date';
import mongoose from 'mongoose';
import Users from '../../models/users/index';
import corsMiddleware from '../../middlewares';

const router = express.Router();

// Create post
router.post('/group/create/:id', corsMiddleware, async (req: Request, res: Response) => {
  const id: string = req.params.id;
  const { name, image, description, category, headOffice } = req.body;
  const { city, state } = headOffice
  const user = await Users.findById(id)
  if (!user) {
    return res.status(422).json({ error: 'Usuário não encontrado!' });
  }
  const group = {
    name,
    image,
    description,
    category,
    headOffice,
    members: [{ user }],
    createdByUser: {
      _id: user._id,
      user: user
    },
    createdAt: now()
  }

  if (!name) {
    return res.status(422).json({ error: 'Preencha um nome!' });
  }
  if (!category) {
    return res.status(422).json({ error: 'Escolha uma categoria!' });
  }
  try {
    const newGroup = await Group.create(group);
    return res.status(201).json({
      message: 'Grupo criado com sucesso!',
      group,
    });
  } catch (error) {
    console.error('Error creating group:', error);
    return res.status(500).json({ error: error });
  }
});
router.delete('/group/delete/:id/:userId', corsMiddleware, async (req: Request, res: Response) => {
  const { id, userId } = req.params;
  try {
    const group: GroupsDocument | null = await Group.findById(id);

    if (!group) {
      return res.status(404).json({ error: 'Grupo não encontrado' });
    }
    const userCreated = await Group.findOne({ 'createdByUser.user._id': userId })
    if (!userCreated) {
      return res.status(401).json({ error: 'Você não tem permissão para excluir este grupo' });
    }

    await Group.findByIdAndDelete(id);
    await Users.updateMany({ $pull: { groupIds: id } });

    res.status(200).json({ message: 'Grupo excluído com sucesso' });
  } catch (error) {
    console.error('Error deleting group:', error);
    res.status(500).json({ error: error });
  }
});

//Get-All group
router.get('/group/get-all', corsMiddleware, async (req: Request, res: Response) => {
  try {
    const name: string = req.query.name as string || '';
    const city: string = req.query.city as string || '';
    const state: string = req.query.state as string || '';
    const category: string = req.query.category as string || '';
    const page = parseInt(req.query.page as string) || 1;
    const pageSize = parseInt(req.query.pageSize as string) || 5;

    const totalCount = await Group.countDocuments(); // Total de documentos 
    const totalPages = Math.ceil(totalCount / pageSize); // Total de páginas
    const nameFilter = name ? { name: { $regex: new RegExp(name, 'i') } } : {};
    const cityFilter = city ? { 'headOffice.city': { $regex: new RegExp(city, 'i') } } : {};
    const stateFilter = state ? { 'headOffice.state': { $regex: new RegExp(state, 'i') } } : {};
    const categoryFilter = category ? { category: { $regex: new RegExp(category, 'i') } } : {};
    const groups = await Group.find({ ...nameFilter, ...cityFilter, ...stateFilter, ...categoryFilter })
      .skip((page - 1) * pageSize) // Ignorar documentos nas páginas anteriores
      .limit(pageSize); // Limitar o número de documentos retornados por página

    res.status(200).json({
      groups,
      page,
      pageSize,
      totalCount,
      totalPages
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error });
  }
});
//Get-by-id group
router.get('/group/get-by-id/:id', corsMiddleware, async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    const group = await Group.findOne({ _id: id });
    if (!group) {
      return res.status(404).json({ error: 'Grupo não encontrado' });
    }
    res.status(201).json({
      group
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error });
  }
});
router.post('/group/add-member/:id/:userId', corsMiddleware, async (req: Request, res: Response) => {
  const { id, userId } = req.params;
  try {
    const user = await Users.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }
    const group = await Group.findById(id);
    if (!group) {
      return res.status(404).json({ message: 'Grupo não encontrado' });
    }
    // const userExists = await Group.findOne({ 'members.user._id': userId });
    const isMember = group.members.some(member => member.user._id.equals(userId));
    // Verifica se o userId já está presente no array memberIds
    console.log(isMember)
    if (isMember) {
      return res.status(400).json({ error: 'Usuário já é membro deste grupo' });
    }

    await Group.findByIdAndUpdate(id, { $addToSet: { members: { user: user } } });
    await Users.findByIdAndUpdate(userId, { $addToSet: { groupIds: id } });

    res.status(200).json({ message: 'Usuário adicionado com sucesso' });
  } catch (error) {
    console.error('Error adding member:', error);
    res.status(500).json({ error: error });
  }
});
router.delete('/group/remove-member/:id/:userId', corsMiddleware, async (req: Request, res: Response) => {
  const { id, userId } = req.params;
  try {
    const user = await Users.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }
    const group = await Group.findById(id);
    if (!group) {
      return res.status(404).json({ message: 'Grupo não encontrado' });
    }
    const UserExist = await Group.findOne({ 'members.user._id': userId })
    console.log(UserExist)
    if (!UserExist) {
      return res.status(400).json({ error: 'Usuário não é membro deste grupo' });
    }
    // Remove the user from the members array
    await Group.updateOne({ $pull: { members: { user: { _id: userId } } } })
    // Save the updated group
    await group.save();
    // Remove the group ID from the user's groupIds array
    await Group.findByIdAndUpdate(id, { $pull: { members: { 'user._id': userId } } });
    await Users.findByIdAndUpdate(userId, { $pull: { groupIds: id } });
    res.status(200).json({ message: 'Usuário removido com sucesso' });
  } catch (error) {
    console.error('Error remove member:', error);
    res.status(500).json({ error: error });
  }
});

router.get('/search', corsMiddleware, async (req: Request, res: Response) => {
  const name: string = req.query.name as string || '';
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 5;
  const skip = (page - 1) * limit;

  try {
    const groupQuery = name ? { name: { $regex: new RegExp(name, 'i') } } : {}; // Pesquisa por nome do grupo
    const userQuery = name ? { 'info.firstName': { $regex: new RegExp(name, 'i') } } : {}; // Pesquisa por nome do usuário

    const [groupCount, userCount, groups, users] = await Promise.all([
      Group.countDocuments(groupQuery),
      Users.countDocuments(userQuery),
      Group.find(groupQuery).skip(skip).limit(limit).lean(),
      Users.find(userQuery).skip(skip).limit(limit).lean()
    ]);

    const groupPageCount = Math.ceil(groupCount / limit); // Número total de páginas para grupos
    const userPageCount = Math.ceil(userCount / limit); // Número total de páginas para usuários

    const result = [...users, ...groups]; // Junta os resultados em um único array, com usuários primeiro
    const totalCount = groupCount + userCount; // Total de registros encontrados

    res.status(200).json({ result, totalCount, groupCount, userCount, groupPageCount, userPageCount });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error });
  }
});
router.patch('/group/update-by-id/:id', corsMiddleware, async (req: Request, res: Response) => {
  const id: string = req.params.id;
  const { name, image, description, category, headOffice } = req.body;
  const { city, state } = headOffice;

  try {
    const attgroup = await Group.findById(id);
    if (!attgroup) {
      return res.status(422).json({ error: 'Grupo não encontrado!' });
    }
    const updateGroup = await Group.updateOne({ _id: id }, req.body);
    const group = await Group.findById(id);
    return res.status(200).json({
      message: 'Dados atualizados com sucesso!',
      group
    });
  } catch (error) {
    return res.status(500).json({ error: error });
  }
});
router.get('/group/trending-groups', corsMiddleware, async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const pageSize = parseInt(req.query.pageSize as string) || 5;

    const totalCount = await Group.countDocuments(); // Total de documentos 
    const totalPages = Math.ceil(totalCount / pageSize); // Total de páginas

    const groups = await Group.aggregate([
      {
        $match: {
          $expr: {
            $gte: [{ $size: "$members" }, 10] // Filtra os grupos com 10 ou mais membros
          }
        }
      },
      { $skip: (page - 1) * pageSize }, // Ignorar documentos nas páginas anteriores
      { $limit: pageSize } // Limitar o número de documentos retornados por página
    ]);
    res.status(200).json({
      groups,
      page,
      pageSize,
      totalCount,
      totalPages
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error });
  }
});
router.get('/group/get-by-user-id/:userId', corsMiddleware, async (req: Request, res: Response) => {
  try {
    const userId: string = req.params.userId;
    const page = parseInt(req.query.page as string) || 1;
    const pageSize = parseInt(req.query.pageSize as string) || 10;
    if (!userId) {
      return res.status(422).json({ error: 'Informe um usuário!' });
    }
    const totalCount = await Group.countDocuments(); // Total de documentos 
    const totalPages = Math.ceil(totalCount / pageSize); // Total de páginas
    const groups = await Group.find({ 'members.user._id': userId })
      .skip((page - 1) * pageSize) // Ignorar documentos nas páginas anteriores
      .limit(pageSize); // Limitar o número de documentos retornados por página

    res.status(200).json({
      groups,
      page,
      pageSize,
      totalCount,
      totalPages
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error });
  }
});
export default router;
