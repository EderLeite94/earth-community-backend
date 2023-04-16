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
    createdByUserId: string;
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
    createdByUserId: { type: String },
    createdAt: { type: Date },
   
});
export interface IGroupId extends IGroup {
    _id: string;
}

const Group = mongoose.model<GroupsDocument>('Group', GroupSchema);

export default Group;