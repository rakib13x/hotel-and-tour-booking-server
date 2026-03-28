import { Types } from "mongoose";
export interface IDestination {
    _id: Types.ObjectId;
    country: string;
    city?: string;
    slug: string;
}
export declare const Destination: import("mongoose").Model<IDestination, {}, {}, {}, import("mongoose").Document<unknown, {}, IDestination, {}, {}> & IDestination & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=destination.model.d.ts.map