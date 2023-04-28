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
        id_comments?: mongoose.Types.ObjectId | undefined | string;
        userId: string;
        comment: string;
    }>;
    createdByUserId: string;
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
        id_comments: { type: mongoose.Schema.Types.ObjectId },
        userId: { type: String },
        comment: { type: String },
    }>,
    createdByUserId: { type: String },
    createdByGroupId: { type: Number },
    createdAt: { type: Date }
});
export interface IFeedithId extends IFeed {
    _id: string;
}

const Post = mongoose.model<FeedDocument>('Post', FeedSchema);

export default Post;