"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const date_1 = require("../../utils/date");
const index_1 = __importDefault(require("../../models/feed/index"));
const index_2 = __importDefault(require("../../models/users/index"));
const mongoose_1 = __importDefault(require("mongoose"));
const group_1 = __importDefault(require("../../models/group"));
const router = express_1.default.Router();
// Create post
router.post('/post/create/:id/:groupID', async (req, res) => {
    const id = req.params.id;
    const groupID = req.params.groupID;
    const { text, image } = req.body;
    const user = await index_2.default.findOne({ _id: id });
    if (!user) {
        return res.status(422).json({ error: 'Usuário não encontrado!' });
    }
    const group = await group_1.default.findById(groupID);
    if (!group) {
        return res.status(400).send({ error: 'Grupo não encontrado!' });
    }
    const usergroup = group.createdByUser.user;
    const post = {
        text,
        image,
        createdByUser: {
            _id: user._id,
            user: user
        },
        createdAt: date_1.now,
        createdByGroup: {
            group: {
                info: group,
                createdByUser: usergroup
            },
        }
    };
    if (!text) {
        return res.status(400).send({ error: 'Insira um texto!' });
    }
    const UserId = await index_2.default.findOne({ _id: id }, req.body);
    if (!UserId) {
        return res.status(400).send({ error: 'Usuário inválido!' });
    }
    try {
        await index_1.default.create(post);
        res.status(201).json({
            message: 'Post criado com sucesso!',
            post,
        });
    }
    catch (error) {
        console.error('Error creating post:', error);
        res.status(500).json({ error: error });
    }
});
//Delete post 
router.delete('/post/delete/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const post = await index_1.default.findById(id);
        if (!post) {
            return res.status(404).send({ error: 'Post não encontrado' });
        }
        await post.deleteOne();
        res.status(200).send({ message: 'Post removido com sucesso' });
    }
    catch (err) {
        console.error(err);
        res.status(500).send({ error: 'Erro ao remover post' });
    }
});
// Get all post
router.get('/post/get-all', async (req, res) => {
    try {
        const { page, perPage } = req.query;
        const pageNumber = parseInt(page) || 1;
        const itemsPerPage = parseInt(perPage) || 10;
        const totalData = await index_1.default.countDocuments();
        const totalPages = Math.ceil(totalData / itemsPerPage);
        const posts = await index_1.default.find()
            .sort({ 'likes.quantity': -1 }) // Sort by likes.quantity in descending order
            .skip((pageNumber - 1) * itemsPerPage)
            .limit(itemsPerPage);
        res.status(200).json({
            posts,
            page: pageNumber,
            perPage: itemsPerPage,
            totalPages,
            totalData,
        });
    }
    catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: error });
    }
});
// Get - Post ID
router.get('/post/get-by-id/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const post = await index_1.default.findOne({ _id: id });
        if (!post) {
            res.status(422).json({ error: 'Post não encontrado!' });
            return;
        }
        res.status(200).json(post);
    }
    catch (error) {
        res.status(500).json({ error: error });
    }
});
// Get - Post createdByGroupId
router.get('/post/get-group-by-id/:id', async (req, res) => {
    const id = req.params.id;
    const page = parseInt(req.query.page) || 1; // Página atual (padrão: 1)
    const perPage = parseInt(req.query.perPage) || 10; // Itens por página (padrão: 10)
    try {
        const totalData = await index_1.default.countDocuments({ 'createdByGroup._id': id });
        const totalPages = Math.ceil(totalData / perPage);
        const posts = await index_1.default.find({ 'createdByGroup._id': id })
            .skip((page - 1) * perPage)
            .limit(perPage);
        res.status(200).json({ posts, page, perPage, totalPages, totalData });
    }
    catch (error) {
        res.status(500).json({ error: error });
    }
});
// Like and unlike
router.post('/post/like/:id/:userId', async (req, res) => {
    const { id, userId } = req.params;
    try {
        const post = await index_1.default.findById(id);
        if (!post) {
            return res.status(404).json({ error: 'Postagem não encontrada' });
        }
        const userLiked = post.likes.userIds.includes(userId);
        if (userLiked) {
            post.likes.userIds = post.likes.userIds.filter((uid) => uid !== userId);
            post.likes.quantity--;
            await post.save();
            res.status(200).json(post);
        }
        else {
            post.likes.userIds.push(userId);
            post.likes.quantity++;
            await post.save();
            res.status(200).json(post);
        }
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});
//Comment
router.post('/post/comment/:id/:userId', async (req, res) => {
    const { id, userId } = req.params;
    const { comment } = req.body;
    try {
        const data = new Date();
        const now = new Date(data.getTime() - (3 * 60 * 60 * 1000));
        const post = await index_1.default.findById(id);
        if (!post) {
            return res.status(404).send({ error: 'Post não encontrado' });
        }
        const user = await index_2.default.findById({ _id: userId });
        if (!user) {
            return res.status(404).send({ error: 'Usuário não encontrado' });
        }
        if (!comment) {
            return res.status(404).send({ error: 'Insira um comentario!' });
        }
        post.comments.push({
            user: user,
            comment,
            createdAt: now,
            _id: new mongoose_1.default.Types.ObjectId()
        });
        await post.save();
        res.status(200).send({ message: 'Comentário adicionado com sucesso' });
    }
    catch (err) {
        console.error(err);
        res.status(500).send({ error: 'Erro ao adicionar comentário' });
    }
});
//delete comment
router.delete('/post/delete-comment/:id/:id_comments', async (req, res) => {
    const { id, id_comments } = req.params;
    try {
        const post = await index_1.default.findById(id);
        if (!post) {
            return res.status(404).send({ error: 'Post não encontrado' });
        }
        const commentIndex = post.comments.findIndex((comment) => String(comment._id) === id_comments);
        if (commentIndex === -1) {
            return res.status(404).send({ error: 'Comentário não encontrado' });
        }
        post.comments.splice(commentIndex, 1);
        await post.updateOne({ comments: post.comments });
        res.status(200).send({ error: 'Comentário removido com sucesso' });
    }
    catch (err) {
        console.error(err);
        res.status(500).send({ error: 'Erro ao remover comentário' });
    }
});
exports.default = router;
//# sourceMappingURL=index.js.map