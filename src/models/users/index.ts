import mongoose, { Document, Schema } from 'mongoose';

export interface IUsers {
    info: {
        _id: any;
        nickName: string;
        firstName: string;
        surname: string;
        email: string;
        about: string;
        dateOfBirth: Date;
        pictureProfile: string;
        phone: string;
    };
    security: {
        authWith: 'google' | 'facebook' | 'manually';
        password: string;
        accountCreateDate: Date;
    };
    address: {
        city: string;
        state: string;
    };
    groupIds: string[];
    donationIds: number[];
}

export type UsersDocument = IUsers & Document;

const UsersSchema: Schema = new Schema({
    info: {
        nickName: { type: String, unique: true },
        firstName: { type: String, required: true },
        surname: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        about: { type: String, default: null },
        dateOfBirth: { type: Date, default: null },
        pictureProfile: { type: String, default: null },
        phone: { type: String, default: null },
    },
    security: {
        authWith: { type: String, enum: ['google', 'facebook', 'manually'] },
        password: { type: String },
        accountCreateDate: { type: Date },
    },
    address: {
        city: { type: String, default: null },
        state: { type: String, default: null },
    },
    groupIds: [{ type: String, default: [] }],
    donationIds: [{ type: Number, default: [] }],
});

export interface IUsersWithId extends IUsers {
    _id: string;
}

const Users = mongoose.model<UsersDocument>('Users', UsersSchema);

export default Users;