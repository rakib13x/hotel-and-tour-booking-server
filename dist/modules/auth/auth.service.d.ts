import { LoginInput, RegisterInput } from "./auth.interface";
import { IUser } from "./auth.model";
declare class AuthService {
    register(input: RegisterInput): Promise<{
        user: IUser;
        token: string;
    }>;
    login(input: LoginInput): Promise<{
        user: IUser;
        token: string;
    }>;
    updateProfile(userId: string, updateData: any): Promise<IUser>;
    changePassword(userId: string, passwordData: any): Promise<IUser>;
    createDefaultAdmin(): Promise<void>;
}
declare const _default: AuthService;
export default _default;
//# sourceMappingURL=auth.service.d.ts.map