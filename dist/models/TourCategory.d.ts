import mongoose, { Document } from "mongoose";
export interface ITourCategory extends Document {
    category_name: string;
    img?: string;
    description?: string;
    createdAt: Date;
    updatedAt: Date;
}
declare const _default: mongoose.Model<any, {}, {}, {}, any, any> | mongoose.Model<ITourCategory, {}, {}, {}, mongoose.Document<unknown, {}, ITourCategory, {}, {}> & ITourCategory & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=TourCategory.d.ts.map