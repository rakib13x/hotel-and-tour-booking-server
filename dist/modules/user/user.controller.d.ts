import { Request, Response } from "express";
declare class UserController {
    createUser: (req: Request, res: Response, next: import("express").NextFunction) => void;
    getAllUsers: (req: Request, res: Response, next: import("express").NextFunction) => void;
    getSingleUser: (req: Request, res: Response, next: import("express").NextFunction) => void;
    updateUser: (req: Request, res: Response, next: import("express").NextFunction) => void;
    deleteUser: (req: Request, res: Response, next: import("express").NextFunction) => void;
    changeUserStatus: (req: Request, res: Response, next: import("express").NextFunction) => void;
    changeUserRole: (req: Request, res: Response, next: import("express").NextFunction) => void;
    getUserStats: (req: Request, res: Response, next: import("express").NextFunction) => void;
}
declare const _default: UserController;
export default _default;
//# sourceMappingURL=user.controller.d.ts.map