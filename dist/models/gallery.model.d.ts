import mongoose from "mongoose";
import { ICategory, IImage, ISubCategory } from "../modules/gallery/gallery.interface";
export declare const Category: mongoose.Model<ICategory, {}, {}, {}, mongoose.Document<unknown, {}, ICategory, {}, {}> & ICategory & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
export declare const SubCategory: mongoose.Model<ISubCategory, {}, {}, {}, mongoose.Document<unknown, {}, ISubCategory, {}, {}> & ISubCategory & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
export declare const Image: mongoose.Model<IImage, {}, {}, {}, mongoose.Document<unknown, {}, IImage, {}, {}> & IImage & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=gallery.model.d.ts.map