import mongoose, { Types } from "mongoose";
export interface ICustomTourQuery {
    _id?: Types.ObjectId;
    name: string;
    email: string;
    phone: string;
    tourId?: Types.ObjectId;
    tourTitle?: string;
    status: "pending" | "contacted" | "closed";
    createdAt?: Date;
    updatedAt?: Date;
}
export declare const CustomTourQuery: mongoose.Model<ICustomTourQuery, {}, {}, {}, mongoose.Document<unknown, {}, ICustomTourQuery, {}, {}> & ICustomTourQuery & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=customTourQuery.model.d.ts.map