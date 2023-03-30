import express, { Request, Response } from 'express';
import Post from '../../models/feed/index';
import { IFeed } from '../../models/feed/index';
import Image from '../../models/feed/index'
import Users from '../../models/users/index';
import multer from 'multer';
import { upload } from '../../config/multer';
import path from 'path';
const router = express.Router();

// Create post
router.post('/post/create/:id', upload.single("image"), async (req: Request, res: Response) => {
    const id: string = req.params.id;
    const { text } = req.body;
    // Date Brazil
    const data = new Date();
    const now = new Date(data.getTime() - (3 * 60 * 60 * 1000));

    if (!text) {
        return res.status(400).send('Insira um texto!');
    }
    const UserId = await Users.findOne({ _id: id }, req.body);
    if (!UserId) {
        return res.status(400).send('Usuário invalido!');
    }
    const post = {
        text,
        createdByUserId: id,
        createdAt: now
    }

    try {
        await Post.create(post);
        res.status(201).json({
            message: 'Post criado com sucesso!',
            post,
        });
    } catch (error) {
        console.error('Error creating post:', error);
        res.status(500).json({ error: error });
    }
});
// Get all post
router.get('/post/get-all', async (req: Request, res: Response) => {
    try {
        const post = await Post.find();
        res.status(201).json({
            post
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: error });
    }
});
// Get - Post ID
router.get('/post/get-by-id/:id', async (req: Request, res: Response) => {
    const id = req.params.id;

    try {
        const post = await Post.findOne({ _id: id });

        if (!post) {
            res.status(422).json({ message: 'Post não encontrado!' });
            return;
        }

        res.status(200).json(post);
    } catch (error) {
        res.status(500).json({ error: error });
    }
});
// Like and unlike
router.post('/post/like/:id/:userId', async (req: Request, res: Response) => {
    const { id, userId } = req.params;
    try {
        const post = await Post.findById(id);

        if (!post) {
            return res.status(404).json({ message: 'Postagem não encontrada' });
        }

        const userLiked = post.likes.userIds.includes(userId);

        if (userLiked) {
            post.likes.userIds = post.likes.userIds.filter((uid) => uid !== userId);
            post.likes.quantity--;

            await post.save();

            res.status(200).json(post);
        } else {
            post.likes.userIds.push(userId);
            post.likes.quantity++;

            await post.save();

            res.status(200).json(post);
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
});
//Comment
router.post('/post/comment/:id/:userId', async (req: Request, res: Response) => {
    const { id, userId } = req.params;
    const { comment } = req.body;

    try {
        const post = await Post.findById(id);
        if (!post) {
            return res.status(404).send('Post não encontrado');
        }
        post.comments.push({ userId, comment });
        await post.save();
        res.status(200).send('Comentário adicionado com sucesso');
    } catch (err) {
        console.error(err);
        res.status(500).send('Erro ao adicionar comentário');
    }
});
//delete comment
router.delete('/post/delete-comment/:id/:_id', async (req: Request, res: Response) => {
    const { id, _id } = req.params;

    try {
        const post = await Post.findById(id);
        if (!post) {
            return res.status(404).send('Post não encontrado');
        }
        const comments = Post.findById(_id);
        if (!comments) {
            return res.status(404).send('Comentário não encontrado');
        }
        await post.save();
        res.status(200).send('Comentário removido com sucesso');
    } catch (err) {
        console.error(err);
        res.status(500).send('Erro ao remover comentário');
    }
});
router.post('/img', upload.single("file"), async (req: Request, res: Response) => {
    try {
        const { name } = req.body;
        const file = req.file;
        if (!file) {
            return res.status(400).json({ message: "Arquivo não enviado." });
        }
        const image = new Image({
            name,
            src: file.path,
        });

        await image.save();
        res.json(image);
    } catch (err) {
        res.status(500).json({ message: "Erro ao salvar a imagem." });
    }
});
router.get('/uploads/feed/:filename', (req: Request, res: Response) => {
    const { filename } = req.params;
    const filePath = path.join(__dirname, 'uploads', filename);
    res.sendFile(filePath);
  });
export default router