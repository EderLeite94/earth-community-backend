import express, { Request, Response, NextFunction } from 'express';
import { validateSignUp, validateSignIn } from '../../validations/users/index';
import { generateUniqueNickname } from '../../utils/nickname/index';
import Users, { IUsers } from '../../models/users/index';
import bcrypt from 'bcrypt';
import moment from 'moment';
import jwt from 'jsonwebtoken';
import Group from '../../models/group';
import Post from '../../models/feed';
import mongoose from 'mongoose';
import {
    FirstPass,
    ArtsCulture,
    Health, Pets,
    Environment,
    Elderly,
    Education,
    ChildrenAdolescents,
    HumanRights,
    Sports,
    TechnologyInnovation
} from './categories';
const router = express.Router();

router.post('/achievement/:id', async (req: Request, res: Response) => {
    const id = req.params.id;

    try {
        const firstpass = await FirstPass(id);
        const elderly = await Elderly(id);
        const artsculture = await ArtsCulture(id);
        const childrenadolescents = await ChildrenAdolescents(id);
        const humanrights = await HumanRights(id);
        const education = await Education(id);
        const sports = await Sports(id);
        const environment = await Environment(id);
        const petInfo = await Pets(id);
        const health = await Health(id)
        const technologyinnovation = await TechnologyInnovation(id)

        const response = [
            { completed: firstpass.completed },
            { completed: elderly.completed },
            { completed: artsculture.completed },
            { completed: childrenadolescents.completed },
            { completed: humanrights.completed },
            { completed: education.completed },
            { completed: education.completed },
            { completed: sports.completed },
            { completed: environment.completed },
            { completed: petInfo.completed },
            { completed: health.completed },
            { completed: technologyinnovation.completed }
        ];
        return res.status(200).json(response);
    } catch (error) {
        return res.status(500).json({
            error: error
        });
    }
});


export default router;
