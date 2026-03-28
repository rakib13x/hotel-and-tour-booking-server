import mongoose, { Document } from "mongoose";
export interface ICountry extends Document {
    name: string;
    imageUrl: string;
    isTop: boolean;
    createdAt: Date;
    updatedAt: Date;
}
declare const _default: mongoose.Model<any, {}, {}, {}, any, any> | mongoose.Model<ICountry, {}, {}, {}, mongoose.Document<unknown, {}, ICountry, {}, {}> & ICountry & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=Country.d.ts.map