import { Request, Response } from "express";
declare class AdminController {
    getAllUsers: (req: Request, res: Response, next: import("express").NextFunction) => void;
    getUserById: (req: Request, res: Response, next: import("express").NextFunction) => void;
    createUser: (req: Request, res: Response, next: import("express").NextFunction) => void;
    updateUser: (req: Request, res: Response, next: import("express").NextFunction) => void;
    deleteUser: (req: Request, res: Response, next: import("express").NextFunction) => void;
    getDashboardStats: (req: Request, res: Response, next: import("express").NextFunction) => void;
    changeUserRole: (req: Request, res: Response, next: import("express").NextFunction) => void;
    getAllowedRoles: (req: Request, res: Response, next: import("express").NextFunction) => void;
}
declare const _default: AdminController;
export default _default;
//# sourceMappingURL=admin.controller.d.ts.map