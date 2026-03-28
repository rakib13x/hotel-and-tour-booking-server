import { Document } from "mongoose";
export interface IUser extends Document {
    name: string | null;
    email: string;
    phone: string | null;
    profileImg: string | null;
    password?: string;
    googleId?: string;
    status: "active" | "block" | "deactive";
    role: "user" | "admin" | "super_admin";
    createdAt: Date;
    updatedAt: Date;
    comparePassword(candidatePassword: string): Promise<boolean>;
}
export interface CreateUserInput {
    name?: string;
    email: string;
    phone?: string;
    profileImg?: string;
    password: string;
    status?: "active" | "block" | "deactive";
    role?: "user" | "admin" | "super_admin";
}
export interface UpdateUserInput {
    name?: string;
    email?: string;
    phone?: string;
    profileImg?: string;
    password?: string;
    status?: "active" | "block" | "deactive";
    role?: "user" | "admin" | "super_admin";
}
export interface UserQuery {
    page?: number;
    limit?: number;
    search?: string;
    status?: "active" | "block" | "deactive";
    role?: "user" | "admin" | "super_admin";
    sortBy?: string;
    sortOrder?: "asc" | "desc";
}
//# sourceMappingURL=user.interface.d.ts.map