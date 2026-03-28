import { Request, Response } from "express";
export declare const FaqController: {
    createFaq: (req: Request, res: Response, next: import("express").NextFunction) => void;
    getAllFaqs: (req: Request, res: Response, next: import("express").NextFunction) => void;
    getSingleFaq: (req: Request, res: Response, next: import("express").NextFunction) => void;
    updateFaq: (req: Request, res: Response, next: import("express").NextFunction) => void;
    deleteFaq: (req: Request, res: Response, next: import("express").NextFunction) => void;
    toggleFaqStatus: (req: Request, res: Response, next: import("express").NextFunction) => void;
    reorderFaqs: (req: Request, res: Response, next: import("express").NextFunction) => void;
    getActiveFaqs: (req: Request, res: Response, next: import("express").NextFunction) => void;
    getFaqStats: (req: Request, res: Response, next: import("express").NextFunction) => void;
};
//# sourceMappingURL=faq.controller.d.ts.map