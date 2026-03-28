import mongoose, { Document } from "mongoose";
export interface IReviewDocument extends Document {
    userName: string;
    userProfileImg?: string;
    designation: string;
    rating: number;
    comment: string;
    order: number;
    createdAt: Date;
    updatedAt: Date;
}
declare const Review: mongoose.Model<IReviewDocument, {}, {}, {}, mongoose.Document<unknown, {}, IReviewDocument, {}, {}> & IReviewDocument & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default Review;
//# sourceMappingURL=review.model.d.ts.map