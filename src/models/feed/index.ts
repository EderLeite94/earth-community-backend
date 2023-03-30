import mongoose, { Document, Schema } from 'mongoose';

export interface IFeed {
    text: string;
    image: {
        name?: { type: string },
        src?: { type: string }
    };
    likes: {
        quantity: number,
        userIds: string[];
    }
    comments: Array<{
        _id?: any;
        userId: string;
        comment: string;
    }>
    createdByUserId: string;
    createdByGroupId: string;
    createdAt: Date;
}

export type FeedDocument = IFeed & Document;

const FeedSchema: Schema = new Schema({
    text: { type: String, required: true },
    image: {
        name: { type: String },
        src: { type: String }
    },
    likes: {
        quantity: { type: Number, default: 0 },
        userIds: { type: [String], default: [] },
    },
    comments: Array<{
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
const ImageSchema = new Schema({
    name: { type: String, required: true },
    src: { type: String, required: true },
  });
  
  module.exports = mongoose.model("Image", ImageSchema);
export default Post;