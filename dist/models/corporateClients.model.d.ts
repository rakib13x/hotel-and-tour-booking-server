import mongoose from "mongoose";
export interface ICorporateClient {
    name: string;
    logo: string;
    order?: number;
}
export declare const CorporateClient: mongoose.Model<ICorporateClient, {}, {}, {}, mongoose.Document<unknown, {}, ICorporateClient, {}, {}> & ICorporateClient & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, any>;
//# sourceMappingURL=corporateClients.model.d.ts.map