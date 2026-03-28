import { Request, Response } from "express";
declare class TourCategoryController {
    createTourCategory: (req: Request, res: Response, next: import("express").NextFunction) => void;
    createTourCategoryWithImage: (req: Request, res: Response, next: import("express").NextFunction) => void;
    getTourCategories: (req: Request, res: Response, next: import("express").NextFunction) => void;
    getAllActiveTourCategories: (req: Request, res: Response, next: import("express").NextFunction) => void;
    getTourCategoryById: (req: Request, res: Response, next: import("express").NextFunction) => void;
    updateTourCategory: (req: Request, res: Response, next: import("express").NextFunction) => void;
    updateTourCategoryWithImage: (req: Request, res: Response, next: import("express").NextFunction) => void;
    deleteTourCategory: (req: Request, res: Response, next: import("express").NextFunction) => void;
}
declare const _default: TourCategoryController;
export default _default;
//# sourceMappingURL=tourCategory.controller.d.ts.map