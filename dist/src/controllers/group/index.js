"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const index_1 = __importDefault(require("../../models/group/index"));
const index_2 = __importDefault(require("../../models/users/index"));
const router = express_1.default.Router();
// Create post
router.post('/group/create/:id', async (req, res) => {
    const id = req.params.id;
    const { name, image, description, category, headOffice } = req.body;
    const { city, state } = headOffice;
    // Date Brazil
    const data = new Date();
    const now = new Date(data.getTime() - (3 * 60 * 60 * 1000));
    const user = await index_2.default.findById(id);
    if (!user) {
        return res.status(422).json({ error: 'Usuário não encontrado!' });
    }
    const group = {
        name,
        image,
        description,
        category,
        headOffice,
        members: user,
        createdByUser: user,
        createdAt: now
    };
    if (!name) {
        return res.status(422).json({ error: 'Preencha um nome!' });
    }
    if (!category) {
        return res.status(422).json({ error: 'Escolha uma categoria!' });
    }
    try {
        const newGroup = await index_1.default.create(group);
        await index_2.default.updateOne({ $push: { members: newGroup._id } });
        return res.status(201).json({
            message: 'Grupo criado com sucesso!',
            group,
        });
    }
    catch (error) {
        console.error('Error creating group:', error);
        return res.status(500).json({ error: error });
    }
});
router.delete('/group/delete/:id/:userId', async (req, res) => {
    const { id, userId } = req.params;
    try {
        const group = await index_1.default.findById(id);
        if (!group) {
            return res.status(404).json({ error: 'Grupo não encontrado' });
        }
        // const userCreated = await Group.findById({ 'createdByUser.user._id': userId })
        // // const userExists = group.createdByUser.find((createdByUser) => createdByUser.user._id.toString() === userId.toString());
        // console.log(userCreated)
        // if (!userCreated) {
        //   return res.status(401).json({ error: 'Você não tem permissão para excluir este grupo' });
        // }
        await index_1.default.findByIdAndDelete(id);
        await index_2.default.updateMany({ $pull: { groupIds: id } });
        res.status(200).json({ message: 'Grupo excluído com sucesso' });
    }
    catch (error) {
        console.error('Error deleting group:', error);
        res.status(500).json({ error: error });
    }
});
//Get-All group
router.get('/group/get-all', async (req, res) => {
    try {
        const group = await index_1.default.find();
        res.status(201).json({
            group
        });
    }
    catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: error });
    }
});
router.get('/group/get-all/:name?/:city?/:state?', async (req, res) => {
    // Function to remove accents from a string
    function removeAccents(text) {
        return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    }
    try {
        const { name, city, state } = req.params;
        const filter = {};
        if (name) {
            filter.name = { $regex: new RegExp(removeAccents(name), 'i') };
        }
        if (city) {
            filter['headOffice.city'] = { $regex: new RegExp(removeAccents(city), 'i') };
        }
        if (state) {
            filter['headOffice.state'] = { $regex: new RegExp(removeAccents(state), 'i') };
        }
        const groups = await index_1.default.where(filter);
        if (name && groups.length === 0) {
            return res.status(404).json({ error: 'O grupo não existe' });
        }
        if (city && groups.length === 0) {
            return res.status(404).json({ error: 'Nenhum grupo encontrado na cidade especificada' });
        }
        if (state && groups.length === 0) {
            return res.status(404).json({ error: 'Nenhum grupo encontrado no estado especificado' });
        }
        res.status(200).json({ groups });
    }
    catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error });
    }
});
//Get-by-id group
router.get('/group/get-by-id/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const group = await index_1.default.findOne({ _id: id });
        if (!group) {
            return res.status(404).json({ error: 'Grupo não encontrado' });
        }
        res.status(201).json({
            group
        });
    }
    catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: error });
    }
});
router.post('/group/add-member/:id/:userId', async (req, res) => {
    const { id, userId } = req.params;
    try {
        const user = await index_2.default.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }
        const group = await index_1.default.findById(id);
        if (!group) {
            return res.status(404).json({ message: 'Grupo não encontrado' });
        }
        const userExists = await index_1.default.findOne({ 'members.user._id': userId });
        // Verifica se o userId já está presente no array memberIds
        if (userExists) {
            return res.status(400).json({ message: 'Usuário já é membro deste grupo' });
        }
        await index_1.default.findByIdAndUpdate(id, { $addToSet: { members: { user: user } } });
        await index_2.default.findByIdAndUpdate(userId, { $addToSet: { groupIds: id } });
        res.status(200).json({ message: 'Usuário adicionado com sucesso' });
    }
    catch (error) {
        console.error('Error adding member:', error);
        res.status(500).json({ error: error });
    }
});
router.delete('/group/remove-member/:id/:userId', async (req, res) => {
    const { id, userId } = req.params;
    try {
        const user = await index_2.default.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }
        const group = await index_1.default.findById(id);
        if (!group) {
            return res.status(404).json({ message: 'Grupo não encontrado' });
        }
        const UserExist = await index_1.default.findOne({ 'members.user._id': userId });
        console.log(UserExist);
        if (!UserExist) {
            return res.status(400).json({ error: 'Usuário não é membro deste grupo' });
        }
        // Remove the user from the members array
        await index_1.default.updateOne({ $pull: { members: { 'user._id': userId } } });
        // Save the updated group
        await group.save();
        // Remove the group ID from the user's groupIds array
        await index_1.default.findByIdAndUpdate(id, { $pull: { members: { user: { _id: userId } } } });
        await index_2.default.findByIdAndUpdate(userId, { $pull: { groupIds: id } });
        res.status(200).json({ message: 'Usuário removido com sucesso' });
    }
    catch (error) {
        console.error('Error remove member:', error);
        res.status(500).json({ error: error });
    }
});
router.get('/search', async (req, res) => {
    const name = req.query.name || '';
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;
    try {
        const groupQuery = name ? { name: { $regex: new RegExp(name, 'i') } } : {}; // Pesquisa por nome do grupo
        const userQuery = name ? { 'info.firstName': { $regex: new RegExp(name, 'i') } } : {}; // Pesquisa por nome do usuário
        const [groupCount, userCount, groups, users] = await Promise.all([
            index_1.default.countDocuments(groupQuery),
            index_2.default.countDocuments(userQuery),
            index_1.default.find(groupQuery).skip(skip).limit(limit).lean(),
            index_2.default.find(userQuery).skip(skip).limit(limit).lean()
        ]);
        const groupPageCount = Math.ceil(groupCount / limit); // Número total de páginas para grupos
        const userPageCount = Math.ceil(userCount / limit); // Número total de páginas para usuários
        const result = [...users, ...groups]; // Junta os resultados em um único array, com usuários primeiro
        const totalCount = groupCount + userCount; // Total de registros encontrados
        res.status(200).json({ result, totalCount, groupCount, userCount, groupPageCount, userPageCount });
    }
    catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: error });
    }
});
exports.default = router;
//# sourceMappingURL=index.js.map