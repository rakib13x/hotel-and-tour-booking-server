import mongoose from "mongoose";
import { ICountryVisa } from "../modules/visa/visa.interface";
export declare const CountryVisa: mongoose.Model<ICountryVisa, {}, {}, {}, mongoose.Document<unknown, {}, ICountryVisa, {}, {}> & ICountryVisa & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=visas.model.d.ts.map