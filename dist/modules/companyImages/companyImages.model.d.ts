import mongoose, { Document } from "mongoose";
export interface ICompanyImages extends Document {
    affiliation: string[];
    paymentAccept: string[];
    createdAt: Date;
    updatedAt: Date;
}
export declare const CompanyImages: mongoose.Model<ICompanyImages, {}, {}, {}, mongoose.Document<unknown, {}, ICompanyImages, {}, {}> & ICompanyImages & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=companyImages.model.d.ts.map