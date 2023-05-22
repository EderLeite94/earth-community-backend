import mongoose, { Document, Schema, Types } from 'mongoose';
type ObjectId = Types.ObjectId;

export interface IFeed {
    text: string;
    image: string;
    likes: {
        quantity: number,
        userIds: string[];
    };
    comments: Array<{
        id_comment?: mongoose.Types.ObjectId | undefined | string;
        userId: string;
        comment: string;
    }>;
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
    createdByGroupId: string;
    createdAt: Date;
}

export type FeedDocument = IFeed & Document;

const FeedSchema: Schema = new Schema({
    text: { type: String, required: true },
    image: { type: String },
    likes: {
        quantity: { type: Number, default: 0 },
        userIds: { type: [String], default: [] },
    },
    comments: Array<{
        id_comment: { type: mongoose.Schema.Types.ObjectId },
        userId: { type: String },
        comment: { type: String },
    }>,
    createdByUser: {
        info: {
            firstName: { type: String, required: true },
            surname: { type: String, required: true },
            email: { type: String, required: true, unique: true },
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
    createdByGroupId: { type: Number },
    createdAt: { type: Date }
});
export interface IFeedithId extends IFeed {
    _id: string;
}

const Post = mongoose.model<FeedDocument>('Post', FeedSchema);

export default Post;