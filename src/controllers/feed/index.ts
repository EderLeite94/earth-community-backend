import express, { Request, Response } from 'express';
import Post from '../../models/feed/index';
import { IFeed } from '../../models/feed/index';
import Image from '../../models/feed/index'
import Users from '../../models/users/index';
import * as path from 'path';
import mongoose from 'mongoose';
const router = express.Router();

// Create post
router.post('/post/create/:id', async (req: Request, res: Response) => {
    const id: string = req.params.id;
    const { text, image } = req.body;
    // Date Brazil
    const data = new Date();
    const now = new Date(data.getTime() - (3 * 60 * 60 * 1000));
    const user = await Users.findOne({ _id: id })

    const post = {
        text,
        image,
        createdByUser: user,
        createdAt: now
    }

    if (!text) {
        return res.status(400).send('Insira um texto!');
    }
    const UserId = await Users.findOne({ _id: id }, req.body);
    if (!UserId) {
        return res.status(400).send('Usuário inválido!');
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

//Delete post 
router.delete('/post/delete/:id', async (req: Request, res: Response) => {
    const id: string = req.params.id;

    try {
        const post = await Post.findById(id);
        if (!post) {
            return res.status(404).send('Post não encontrado');
        }

        await post.deleteOne();
        res.status(200).send('Post removido com sucesso');
    } catch (err) {
        console.error(err);
        res.status(500).send('Erro ao remover post');
    }
});

// Get all post
router.get('/post/get-all', async (req: Request, res: Response) => {
    try {
        const { page, perPage } = req.query;
        const pageNumber = parseInt(page as string) || 1;
        const itemsPerPage = parseInt(perPage as string) || 10;

        const totalData = await Post.countDocuments();
        const totalPages = Math.ceil(totalData / itemsPerPage);

        const posts = await Post.find()
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
        const user = await Users.findOne({ userId })
        if (!user) {
            return res.status(404).send('Usuário não encontrado');
        }
        post.comments.push({
            user: user,
            comment,
            commentId: new mongoose.Types.ObjectId()
        });
        await post.save();
        res.status(200).send('Comentário adicionado com sucesso');
    } catch (err) {
        console.error(err);
        res.status(500).send('Erro ao adicionar comentário');
    }
});
//delete comment
router.delete('/post/delete-comment/:id/:id_comment', async (req: Request, res: Response) => {
    const { id, commentId } = req.params;

    try {
        const post = await Post.findById(id);
        if (!post) {
            return res.status(404).send('Post não encontrado');
        }

        const commentIndex = post.comments.findIndex((comment) => String(comment.commentId) === commentId);
        if (commentIndex === -1) {
            return res.status(404).send('Comentário não encontrado');
        }

        post.comments.splice(commentIndex, 1);
        await post.save();
        res.status(200).send('Comentário removido com sucesso');
    } catch (err) {
        console.error(err);
        res.status(500).send('Erro ao remover comentário');
    }
});

export default router