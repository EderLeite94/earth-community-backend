import express, { Request, Response, NextFunction } from 'express';
import Users, { IUsers } from '../../../models/users/index';
import Group from '../../../models/group';

export async function Pets(id: any): Promise<{ completed: boolean }> {
    try {
        const users: IUsers | null = await Group.findOne({ 'members.user._id': id });
        const userCount: number = await Group.countDocuments({
            'members.user._id': id,
            'category': 'Proteção Animal'
        });
        if (userCount >= 2) {
            return { completed: true };
        } else {
            return { completed: false };
        }
    } catch (error) {
        throw error;
    }
}
