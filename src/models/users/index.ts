import mongoose, { Document, Schema } from 'mongoose';

export interface IUsers {
    info: {
        _id: any;
        firstName: string;
        surName: string;
        email: string;
        dateOfBirth: Date;
        phone: string
    }
    security: {
        password: string;
        accountCreateDate: Date;
    }
    address: {
        city: string;
        state: string
    },
    groupIds: number[]
}

export type UsersDocument = IUsers & Document;

const UsersSchema: Schema = new Schema({
    info: {
        firstName: { type: String, required: true },
        surName: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        dateOfBirth: { type: Date },
        phone: { type: String }
    },
    security: {
        password: { type: String },
        accountCreateDate: { type: Date },
    },
    address: {
        city: { type: String },
        state: { type: String }
    },
    groupIds: [{ type: Number }]
});
export interface IUsersithId extends IUsers {
    _id: string;
}

const Users = mongoose.model<UsersDocument>('Users', UsersSchema);

export default Users;