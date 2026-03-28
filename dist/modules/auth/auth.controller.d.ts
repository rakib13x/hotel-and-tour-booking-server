import { Request, Response } from "express";
declare class AuthController {
    register: (req: Request, res: Response, next: import("express").NextFunction) => void;
    login: (req: Request, res: Response, next: import("express").NextFunction) => void;
    updateProfile: (req: Request, res: Response, next: import("express").NextFunction) => void;
    changePassword: (req: Request, res: Response, next: import("express").NextFunction) => void;
    uploadProfileImage: (req: Request, res: Response, next: import("express").NextFunction) => void;
    googleCallback: (req: Request, res: Response, next: import("express").NextFunction) => void;
    getCurrentUser: (req: Request, res: Response, next: import("express").NextFunction) => void;
}
declare const _default: AuthController;
export default _default;
//# sourceMappingURL=auth.controller.d.ts.map