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
        _id: mongoose.Types.ObjectId | undefined | string;
        user: {
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
        }
        comment: string;
        createdAt: Date;
    }>;
    createdByUser: {
        info: {
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
    };
    createdByGroup: {
        _id: any;
        group: {
            _id: any;
            name: string;
            image: string;
            description: string;
            category: string;
            headOffice: {
                city: string;
                state: string;
            }
        };
    };
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
        _id: {
            type: mongoose.Schema.Types.ObjectId
        },
        user: {
            info: {
                nickName: { type: String },
                firstName: { type: String },
                surname: { type: String },
                email: { type: String },
                about: { type: String },
                dateOfBirth: { type: Date },
                pictureProfile: { type: String },
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
        createdAt: { type: Date },
    }>,
    createdByUser: {
        info: {
            nickName: { type: String },
            firstName: { type: String },
            surname: { type: String },
            email: { type: String },
            about: { type: String },
            dateOfBirth: { type: Date },
            pictureProfile: { type: String },
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
    createdByGroup: {
        _id: { type: Schema.Types.ObjectId, ref: 'Group' },
        name: { type: String },
        image: { type: String },
        description: { type: String },
        category: { type: String },
        headOffice: {
            city: { type: String },
            state: { type: String },
        },
    },
    createdAt: { type: Date }
});

export interface IFeedWithId extends IFeed {
    _id: string;
}

const Post = mongoose.model<FeedDocument>('Post', FeedSchema);

export default Post;
