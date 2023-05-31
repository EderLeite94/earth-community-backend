import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import Group from '../../models/group/index';
import Users from '../../models/users/index';

const router = express.Router();

// Create post
router.post('/group/create/:id', async (req: Request, res: Response) => {
  const id: string = req.params.id;
  const { name, image, description, category, headOffice } = req.body;
  const { city, state } = headOffice
  // Date Brazil
  const data = new Date();
  const now = new Date(data.getTime() - (3 * 60 * 60 * 1000));
  const user = await Users.findById(id)
  const group = {
    name,
    image,
    description,
    category,
    headOffice,
    memberIds: {
      userId: id,
    },
    createdByUser: user,
    createdAt: now
  }

  if (!name) {
    return res.status(422).json({ error: 'Preencha um nome!' });
  }
  if (!category) {
    return res.status(422).json({ error: 'Escolha uma categoria!' });
  }
  try {
    const newGroup = await Group.create(group);
    await Users.updateOne(
      { $push: { groupIds: newGroup._id } }
    );
    return res.status(201).json({
      message: 'Grupo criado com sucesso!',
      group,
    });
  } catch (error) {
    console.error('Error creating group:', error);
    return res.status(500).json({ error: error });
  }
});
// Delete group
router.delete('/group/delete/:id/:userId', async (req: Request, res: Response) => {
  try {
    const { id, userId } = req.params;
    const group = await Group.findById(id);

    if (!group) {
      return res.status(404).json({ error: 'Grupo não encontrado' });
    }

    // if (group.createdByUser !== userId) {
    //   return res.status(401).json({ error: 'Você não tem permissão para excluir este grupo' });
    // }

    await Group.findByIdAndDelete(id);
    await Users.updateMany({ $pull: { groupIds: id } });

    res.status(200).json({ message: 'Grupo excluído com sucesso' });
  } catch (error) {
    console.error('Error deleting group:', error);
    res.status(500).json({ error: error });
  }
});
//Get-All group
router.get('/group/get-all', async (req: Request, res: Response) => {
  try {
    const group = await Group.find();
    res.status(201).json({
      group
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error });
  }
});
//Get-by-id group
router.get('/group/get-by-id/:id', async (req: Request, res: Response) => {
  const id = req.params;
  try {
    const group = await Group.findOne({ id });
    res.status(201).json({
      group
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error });
  }
});
router.post('/group/add-member/:id/:userId', async (req: Request, res: Response) => {
  const { id, userId } = req.params;
  try {
    const group = await Group.findById(id);
    if (!group) {
      return res.status(404).json({ error: 'Grupo não encontrado' });
    }
    // Verifica se o userId já está presente no array memberIds
    const userExists = group.memberIds.find(member => member.userId === userId);
    if (userExists) {
      return res.status(400).json({ error: 'Usuário já é membro deste grupo' });
    }

    await Group.findByIdAndUpdate(id, { $addToSet: { memberIds: { userId } } });
    await Users.findByIdAndUpdate(userId, { $addToSet: { groupIds: id } });

    res.status(200).json({ message: 'Usuário adicionado com sucesso' });
  } catch (error) {
    console.error('Error adding member:', error);
    res.status(500).json({ error: error });
  }
});
router.delete('/group/remove-member/:id/:userId', async (req: Request, res: Response) => {
  const { id, userId } = req.params;

  try {
    const group = await Group.findById(id);
    const UserExist = await Group.findOne({ memberIds: userId })
    if (!group) {
      return res.status(404).json({ error: 'Grupo não encontrado' });
    }
    if (!UserExist) {
      return res.status(400).json({ error: 'Usuário não é membro deste grupo' });
    }

    await Group.findByIdAndUpdate(id, { $pull: { memberIds: userId } });
    await Users.findByIdAndUpdate(userId, { $pull: { groupIds: id } });

    res.status(200).json({ message: 'Usuário removido com sucesso' });
  } catch (error) {
    console.error('Error remove member:', error);
    res.status(500).json({ error: error });
  }
});
router.get('/search', async (req: Request, res: Response) => {
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

export default router;
