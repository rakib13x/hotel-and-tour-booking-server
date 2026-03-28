import mongoose, { Document } from "mongoose";
export interface IUser extends Document {
    name: string | null;
    email: string;
    phone: string | null;
    profileImg: string | null;
    password?: string;
    googleId?: string;
    status: "active" | "block" | "deactive";
    role: "admin" | "user" | "super_admin";
    createdAt: Date;
    updatedAt: Date;
    comparePassword(candidatePassword: string): Promise<boolean>;
}
declare const User: mongoose.Model<IUser, {}, {}, {}, mongoose.Document<unknown, {}, IUser, {}, {}> & IUser & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default User;
//# sourceMappingURL=auth.model.d.ts.map