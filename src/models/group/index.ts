import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IGroup {
    name: string;
    image: string;
    description: string;
    category: string;
    headOffice: {
        city: string;
        state: string;
    }
    memberIds: Array<{
        userId: string;
    }>
    createdByUser: {
        info: {
            _id: any;
            firstName: string;
            surname: string;
            email: string;
            dateOfBirth: Date;
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
    };
    createdAt: Date;
}

export type GroupsDocument = IGroup & Document;

const GroupSchema: Schema = new Schema({
    name: { type: String },
    image: { type: String },
    description: { type: String },
    category: { type: String },
    headOffice: {
        city: { type: String },
        state: { type: String },
    },
    memberIds: Array<{
        userId: { type: String },
    }>,
    createdByUser: {
        info: {
            firstName: { type: String},
            surname: { type: String},
            email: { type: String},
            dateOfBirth: { type: Date },
            phone: { type: String },
        },
        security: {
            authWith: { type: String, enum: ['google', 'facebook', 'manually'] },
            password: { type: String },
            accountCreateDate: { type: Date },
        },
        address: {
            city: { type: String },
            state: { type: String },
        },
        groupIds: [{ type: String }],
        donationIds: [{ type: Number }],
    },
    createdAt: { type: Date },

});
export interface IGroupId extends IGroup {
    _id: string;
}

const Group = mongoose.model<GroupsDocument>('Group', GroupSchema);

export default Group;