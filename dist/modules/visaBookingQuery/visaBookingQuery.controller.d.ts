import { Request, Response } from "express";
declare class VisaBookingQueryController {
    createVisaBookingQuery: (req: Request, res: Response, next: import("express").NextFunction) => void;
    getVisaBookingQueries: (req: Request, res: Response, next: import("express").NextFunction) => void;
    getVisaBookingQueryById: (req: Request, res: Response, next: import("express").NextFunction) => void;
    updateVisaBookingQueryStatus: (req: Request, res: Response, next: import("express").NextFunction) => void;
    deleteVisaBookingQuery: (req: Request, res: Response, next: import("express").NextFunction) => void;
    getVisaBookingQueryStats: (req: Request, res: Response, next: import("express").NextFunction) => void;
    getMyVisaBookingQueries: (req: Request, res: Response, next: import("express").NextFunction) => void;
}
declare const _default: VisaBookingQueryController;
export default _default;
//# sourceMappingURL=visaBookingQuery.controller.d.ts.map