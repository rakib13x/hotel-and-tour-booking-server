import { Document } from "mongoose";
export interface IBanner extends Document {
    title: string;
    description: string;
    backgroundImage: string;
    createdAt: Date;
    updatedAt: Date;
}
//# sourceMappingURL=banner.interface.d.ts.map