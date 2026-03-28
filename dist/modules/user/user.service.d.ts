import mongoose from "mongoose";
import { CreateUserInput, IUser, UpdateUserInput, UserQuery } from "./user.interface";
export declare const UserService: {
    createUserIntoDB: (payload: CreateUserInput) => Promise<IUser>;
    getAllUsersFromDB: (query: UserQuery) => Promise<{
        data: (mongoose.Document<unknown, {}, import("../auth/auth.model").IUser, {}, {}> & import("../auth/auth.model").IUser & Required<{
            _id: mongoose.Types.ObjectId;
        }> & {
            __v: number;
        })[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            pages: number;
        };
    }>;
    getSingleUserFromDB: (id: string) => Promise<IUser | null>;
    updateUserIntoDB: (id: string, payload: UpdateUserInput) => Promise<IUser | null>;
    deleteUserFromDB: (id: string) => Promise<IUser | null>;
    changeUserStatusInDB: (id: string, status: "active" | "block" | "deactive") => Promise<IUser | null>;
    changeUserRoleInDB: (id: string, role: "user" | "admin" | "super_admin") => Promise<IUser | null>;
    getUserStatsFromDB: () => Promise<any>;
};
//# sourceMappingURL=user.service.d.ts.map