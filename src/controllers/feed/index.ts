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
        return res.status(400).send({ error: 'Insira um texto!' });
    }
    const UserId = await Users.findOne({ _id: id }, req.body);
    if (!UserId) {
        return res.status(400).send({ error: 'Usuário inválido!' });
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
            return res.status(404).send({ error: 'Post não encontrado' });
        }

        await post.deleteOne();
        res.status(200).send({ message: 'Post removido com sucesso' });
    } catch (err) {
        console.error(err);
        res.status(500).send({ error: 'Erro ao remover post' });
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
            res.status(422).json({ error: 'Post não encontrado!' });
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
            return res.status(404).json({ error: 'Postagem não encontrada' });
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
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});
//Comment
router.post('/post/comment/:id/:userId', async (req: Request, res: Response) => {
    const { id, userId } = req.params;
    const { comment } = req.body;
    try {
        const data = new Date();
        const now = new Date(data.getTime() - (3 * 60 * 60 * 1000));
        const post = await Post.findById(id);
        if (!post) {
            return res.status(404).send({ error: 'Post não encontrado' });
        }
        const user = await Users.findById({ _id: userId })
        if (!user) {
            return res.status(404).send({ error: 'Usuário não encontrado' });
        }
        if (!comment) {
            return res.status(404).send({ error: 'Insira um comentario!' })
        }
        post.comments.push({
            user: user,
            comment,
            createdAt: now,
            _id: new mongoose.Types.ObjectId()
        });
        await post.save();
        res.status(200).send({ message: 'Comentário adicionado com sucesso' });
    } catch (err) {
        console.error(err);
        res.status(500).send({ error: 'Erro ao adicionar comentário' });
    }
});
//delete comment
router.delete('/post/delete-comment/:id/:id_comments', async (req: Request, res: Response) => {
    const { id, id_comments } = req.params;

    try {
        const post = await Post.findById(id);
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
    } catch (err) {
        console.error(err);
        res.status(500).send({ error: 'Erro ao remover comentário' });
    }
});
export default router