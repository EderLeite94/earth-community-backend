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
    };
    if (!name) {
        return res.status(422).json({ message: 'Preencha um nome!' });
    }
    if (!category) {
        return res.status(422).json({ message: 'Escolha uma categoria!' });
    }
    try {
        const newGroup = await index_1.default.create(group);
        await index_2.default.updateOne({ $push: { groupIds: newGroup._id } });
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
// Delete group
router.delete('/group/delete/:id/:userId', async (req, res) => {
    const { id, userId } = req.params;
    try {
        const group = await index_1.default.findById(id);
        if (!group) {
            return res.status(404).json({ message: 'Grupo não encontrado' });
        }
        if (group.createdByUserId !== userId) {
            return res.status(401).json({ message: 'Você não tem permissão para excluir este grupo' });
        }
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
//Get-by-id group
router.get('/group/get-by-id/:id', async (req, res) => {
    const id = req.params;
    try {
        const group = await index_1.default.findOne(id);
        res.status(201).json({
            group
        });
    }
    catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: error });
    }
});
exports.default = router;
//# sourceMappingURL=index.js.map