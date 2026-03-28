import mongoose from "mongoose";
import { IAuthorization } from "./authorization.interface";
interface CreateAuthorizationInput {
    image: string;
}
interface UpdateAuthorizationInput extends Partial<CreateAuthorizationInput> {
}
export declare const AuthorizationService: {
    createAuthorizationIntoDB: (payload: CreateAuthorizationInput) => Promise<IAuthorization>;
    getAllAuthorizationsFromDB: (query: Record<string, any>) => Promise<{
        data: mongoose.Document<mongoose.Types.ObjectId, any, any, Record<string, any>, {}>[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            pages: number;
        };
    }>;
    getSingleAuthorizationFromDB: (id: string) => Promise<IAuthorization | null>;
    updateAuthorizationIntoDB: (id: string, payload: UpdateAuthorizationInput) => Promise<IAuthorization | null>;
    deleteAuthorizationFromDB: (id: string) => Promise<IAuthorization | null>;
};
export {};
//# sourceMappingURL=authorization.service.d.ts.map