import mongoose, { Document } from "mongoose";
export interface IFaq extends Document {
    question: string;
    answer: string;
    orderIndex: number;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
export declare const Faq: mongoose.Model<IFaq, {}, {}, {}, mongoose.Document<unknown, {}, IFaq, {}, {}> & IFaq & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=faq.model.d.ts.map