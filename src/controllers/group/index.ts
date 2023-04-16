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
  const group = {
    name,
    image,
    description,
    category,
    headOffice,
    memberIds: {
      userId: id,
    },
    createdByUserId: id,
    createdAt: now
  }

  if (!name) {
    return res.status(422).json({ message: 'Preencha um nome!' });
  }
  if (!category) {
    return res.status(422).json({ message: 'Escolha uma categoria!' });
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
  const { id, userId } = req.params;

  try {
    const group = await Group.findById(id);

    if (!group) {
      return res.status(404).json({ message: 'Grupo não encontrado' });
    }

    if (group.createdByUserId !== userId) {
      return res.status(401).json({ message: 'Você não tem permissão para excluir este grupo' });
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
    const group = await Group.findOne(id);
    res.status(201).json({
      group
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error });
  }
});
export default router;
