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
import { Pets } from './father-mother-pet';
import { ArtsCulture } from './arts-culture';
import { Education } from './education';
import { Environment } from './environment';
import { Health } from './health';
const router = express.Router();

router.post('/achievement/:id', async (req: Request, res: Response) => {
    const id = req.params.id;

    try {
        const firstpass = await firstPass(id);
        const artsculture = await ArtsCulture(id);
        const education = await Education(id);
        const environment = await Environment(id);
        const petInfo = await Pets(id);
        const health = await Health(id)
        const response = [
            { completed: firstpass.completed },
            { completed: artsculture.completed },
            { completed: education.completed },
            { completed: environment.completed },
            { completed: petInfo.completed },
            { completed: health.completed }
        ];
        return res.status(200).json(response);
    } catch (error) {
        return res.status(500).json({
            error: error
        });
    }
});


export default router;
