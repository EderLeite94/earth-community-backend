import express, { Request, Response, NextFunction } from 'express';
import Users, { IUsers } from '../../models/users/index';
import bcrypt from 'bcrypt';
import moment from 'moment';
import jwt from 'jsonwebtoken';
import { validateSignUp, validateSignIn } from '../../validations/users/index';
import Group from '../../models/group';
import { generateUniqueNickname } from '../users/nickname/index';
import Post from '../../models/feed';
import mongoose from 'mongoose';
import { firstPass } from './firstpass/index';

const router = express.Router();

router.post('/achievement/:id', async (req: Request, res: Response) => {
    const id = req.params.id;

    try {
        const FirstPass = await firstPass(id);
        return res.status(200).json({
            FirstPass
        });
    } catch (error) {
        return res.status(500).json({
            error: error,
        });
    }
});

export default router;