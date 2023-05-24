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
        commentId?: {
            _id: mongoose.Types.ObjectId | undefined | string;
        };
        user: {
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
        }
        comment: string;
    }>;
    createdByUser: {
        info: {
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
        commentId: {
            _id: { type: mongoose.Schema.Types.ObjectId },
        },
        user: {
            info: {
                firstName: { type: String },
                surname: { type: String },
                email: { type: String },
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
        },
        comment: { type: String },
    }>,
    createdByUser: {
        info: {
            firstName: { type: String },
            surname: { type: String },
            email: { type: String },
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

export interface IFeedWithId extends IFeed {
    _id: string;
}

const Post = mongoose.model<FeedDocument>('Post', FeedSchema);

export default Post;
