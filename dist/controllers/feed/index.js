"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const index_1 = __importDefault(require("../../models/feed/index"));
const index_2 = __importDefault(require("../../models/users/index"));
const mongoose_1 = __importDefault(require("mongoose"));
const router = express_1.default.Router();
// Create post
router.post('/post/create/:id', async (req, res) => {
    const id = req.params.id;
    const { text } = req.body;
    // Date Brazil
    const data = new Date();
    const now = new Date(data.getTime() - (3 * 60 * 60 * 1000));
    const post = {
        text,
        createdByUserId: id,
        createdAt: now
    };
    if (!text) {
        return res.status(400).send('Insira um texto!');
    }
    const UserId = await index_2.default.findOne({ _id: id }, req.body);
    if (!UserId) {
        return res.status(400).send('Usuário invalido!');
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
            return res.status(404).send('Post não encontrado');
        }
        await post.deleteOne();
        res.status(200).send('Post removido com sucesso');
    }
    catch (err) {
        console.error(err);
        res.status(500).send('Erro ao remover post');
    }
});
// Get all post
router.get('/post/get-all', async (req, res) => {
    try {
        const post = await index_1.default.find();
        res.status(201).json({
            post
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
            res.status(422).json({ message: 'Post não encontrado!' });
            return;
        }
        res.status(200).json(post);
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
            return res.status(404).json({ message: 'Postagem não encontrada' });
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
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
});
//Comment
router.post('/post/comment/:id/:userId', async (req, res) => {
    const { id, userId } = req.params;
    const { comment } = req.body;
    try {
        const post = await index_1.default.findById(id);
        if (!post) {
            return res.status(404).send('Post não encontrado');
        }
        post.comments.push({
            userId, comment, id_comments: new mongoose_1.default.Types.ObjectId()
        });
        await post.save();
        res.status(200).send('Comentário adicionado com sucesso');
    }
    catch (err) {
        console.error(err);
        res.status(500).send('Erro ao adicionar comentário');
    }
});
//delete comment
router.delete('/post/delete-comment/:id/:id_comments', async (req, res) => {
    const { id, id_comments } = req.params;
    try {
        const post = await index_1.default.findById(id);
        if (!post) {
            return res.status(404).send('Post não encontrado');
        }
        const commentIndex = post.comments.findIndex((comment) => String(comment.id_comments) === id_comments);
        if (commentIndex === -1) {
            return res.status(404).send('Comentário não encontrado');
        }
        post.comments.splice(commentIndex, 1);
        await post.save();
        res.status(200).send('Comentário removido com sucesso');
    }
    catch (err) {
        console.error(err);
        res.status(500).send('Erro ao remover comentário');
    }
});
exports.default = router;
//# sourceMappingURL=index.js.map