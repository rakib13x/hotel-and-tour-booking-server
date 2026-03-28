import mongoose from "mongoose";
import { IBlog } from "../modules/blogs/blogs.interface";
export declare const Blog: mongoose.Model<IBlog, {}, {}, {}, mongoose.Document<unknown, {}, IBlog, {}, {}> & IBlog & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, any>;
//# sourceMappingURL=blogs.model.d.ts.map