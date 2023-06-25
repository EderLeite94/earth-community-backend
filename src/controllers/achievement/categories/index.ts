import express, { Request, Response, NextFunction } from 'express';
import Users, { IUsers } from '../../../models/users/index';
import Group from '../../../models/group';

export async function FirstPass(id: any): Promise<{ completed: boolean }> {
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
export async function ArtsCulture(id: any): Promise<{ completed: boolean }> {
    try {
        const users: IUsers | null = await Group.findOne({ 'members.user._id': id });
        const userCount: number = await Group.countDocuments({
            'members.user._id': id,
            'category': 'Artes e Cultura'
        });
        if (userCount >= 1) {
            return { completed: true };
        } else {
            return { completed: false };
        }
    } catch (error) {
        throw error;
    }
}
export async function Health(id: any): Promise<{ completed: boolean }> {
    try {
        const users: IUsers | null = await Group.findOne({ 'members.user._id': id });
        const userCount: number = await Group.countDocuments({
            'members.user._id': id,
            'category': 'Saúde'
        });
        if (userCount >= 1) {
            return { completed: true };
        } else {
            return { completed: false };
        }
    } catch (error) {
        throw error;
    }
}
export async function Pets(id: any): Promise<{ completed: boolean }> {
    try {
        const users: IUsers | null = await Group.findOne({ 'members.user._id': id });
        const userCount: number = await Group.countDocuments({
            'members.user._id': id,
            'category': 'Proteção aos Animais'
        });
        if (userCount >= 1) {
            return { completed: true };
        } else {
            return { completed: false };
        }
    } catch (error) {
        throw error;
    }
}
export async function Environment(id: any): Promise<{ completed: boolean }> {
    try {
        const users: IUsers | null = await Group.findOne({ 'members.user._id': id });
        const userCount: number = await Group.countDocuments({
            'members.user._id': id,
            'category': 'Meio Ambiente'
        });
        if (userCount >= 1) {
            return { completed: true };
        } else {
            return { completed: false };
        }
    } catch (error) {
        throw error;
    }
}
export async function Elderly(id: any): Promise<{ completed: boolean }> {
    try {
        const users: IUsers | null = await Group.findOne({ 'members.user._id': id });
        const userCount: number = await Group.countDocuments({
            'members.user._id': id,
            'category': 'Apoio aos Idosos'
        });
        if (userCount >= 1) {
            return { completed: true };
        } else {
            return { completed: false };
        }
    } catch (error) {
        throw error;
    }
}
export async function Education(id: any): Promise<{ completed: boolean }> {
    try {
        const users: IUsers | null = await Group.findOne({ 'members.user._id': id });
        const userCount: number = await Group.countDocuments({
            'members.user._id': id,
            'category': 'Educação'
        });
        if (userCount >= 1) {
            return { completed: true };
        } else {
            return { completed: false };
        }
    } catch (error) {
        throw error;
    }
}
export async function ChildrenAdolescents(id: any): Promise<{ completed: boolean }> {
    try {
        const users: IUsers | null = await Group.findOne({ 'members.user._id': id });
        const userCount: number = await Group.countDocuments({
            'members.user._id': id,
            'category': 'Crianças e Adolescentes'
        });
        if (userCount >= 1) {
            return { completed: true };
        } else {
            return { completed: false };
        }
    } catch (error) {
        throw error;
    }
}
export async function HumanRights(id: any): Promise<{ completed: boolean }> {
    try {
        const users: IUsers | null = await Group.findOne({ 'members.user._id': id });
        const userCount: number = await Group.countDocuments({
            'members.user._id': id,
            'category': 'Direitos Humanos'
        });
        if (userCount >= 1) {
            return { completed: true };
        } else {
            return { completed: false };
        }
    } catch (error) {
        throw error;
    }
}
export async function Sports(id: any): Promise<{ completed: boolean }> {
    try {
        const users: IUsers | null = await Group.findOne({ 'members.user._id': id });
        const userCount: number = await Group.countDocuments({
            'members.user._id': id,
            'category': 'Esportes'
        });
        if (userCount >= 1) {
            return { completed: true };
        } else {
            return { completed: false };
        }
    } catch (error) {
        throw error;
    }
}
export async function TechnologyInnovation(id: any): Promise<{ completed: boolean }> {
    try {
        const users: IUsers | null = await Group.findOne({ 'members.user._id': id });
        const userCount: number = await Group.countDocuments({
            'members.user._id': id,
            'category': 'Tecnologia e Inovação Social'
        });
        if (userCount >= 1) {
            return { completed: true };
        } else {
            return { completed: false };
        }
    } catch (error) {
        throw error;
    }
}
export const endpoints = {
    FirstPass,
    ArtsCulture,
    Health,
    Pets,
    Environment,
    Elderly,
    Education,
    ChildrenAdolescents,
    HumanRights,
    Sports,
    TechnologyInnovation
};

