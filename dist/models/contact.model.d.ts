import mongoose from "mongoose";
export interface IContact {
    _id?: string;
    name: string;
    email: string;
    phone: string;
    message: string;
    createdAt?: Date;
    updatedAt?: Date;
}
export declare const Contact: mongoose.Model<IContact, {}, {}, {}, mongoose.Document<unknown, {}, IContact, {}, {}> & IContact & Required<{
    _id: string;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=contact.model.d.ts.map