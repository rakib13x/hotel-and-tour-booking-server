import mongoose from "mongoose";
import { IBanner } from "../modules/banner/banner.interface";
export declare const Banner: mongoose.Model<IBanner, {}, {}, {}, mongoose.Document<unknown, {}, IBanner, {}, {}> & IBanner & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=banner.model.d.ts.map