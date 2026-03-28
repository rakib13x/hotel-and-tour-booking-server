import { NextFunction, Request, Response } from "express";
declare global {
    namespace Express {
        interface User {
            id?: string;
            role?: string;
        }
    }
}
declare const protect: (req: Request, res: Response, next: NextFunction) => void;
export default protect;
//# sourceMappingURL=authMiddleware.d.ts.map