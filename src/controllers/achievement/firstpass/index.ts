import express, { Request, Response, NextFunction } from 'express';
import Users, { IUsers } from '../../../models/users/index';

export async function firstPass(id: any): Promise<{ completed: boolean }> {
    try {
        const user: IUsers | null = await Users.findOne({ _id: id });
        if (user) {
            return { completed: true };
        } else {
            return { completed: false };
        }
    } catch (error) {
        throw error;
    }
}