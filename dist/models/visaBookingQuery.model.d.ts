import { Types } from "mongoose";
export interface IVisaBookingQuery {
    _id?: Types.ObjectId;
    country: string;
    visaType: string;
    type: "query" | "application";
    name: string;
    email: string;
    phone: string;
    status: "pending" | "contacted" | "closed";
    createdAt?: Date;
    updatedAt?: Date;
}
export declare const VisaBookingQuery: import("mongoose").Model<IVisaBookingQuery, {}, {}, {}, import("mongoose").Document<unknown, {}, IVisaBookingQuery, {}, {}> & IVisaBookingQuery & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=visaBookingQuery.model.d.ts.map