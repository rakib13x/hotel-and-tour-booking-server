import { Request, Response } from "express";
export declare const GalleryController: {
    createCategory: (req: Request, res: Response, next: import("express").NextFunction) => void;
    getAllCategories: (req: Request, res: Response, next: import("express").NextFunction) => void;
    getActiveCategories: (req: Request, res: Response, next: import("express").NextFunction) => void;
    getSingleCategory: (req: Request, res: Response, next: import("express").NextFunction) => void;
    updateCategory: (req: Request, res: Response, next: import("express").NextFunction) => void;
    deleteCategory: (req: Request, res: Response, next: import("express").NextFunction) => void;
    createSubCategory: (req: Request, res: Response, next: import("express").NextFunction) => void;
    getAllSubCategories: (req: Request, res: Response, next: import("express").NextFunction) => void;
    getSubCategoriesByCategory: (req: Request, res: Response, next: import("express").NextFunction) => void;
    getSingleSubCategory: (req: Request, res: Response, next: import("express").NextFunction) => void;
    updateSubCategory: (req: Request, res: Response, next: import("express").NextFunction) => void;
    deleteSubCategory: (req: Request, res: Response, next: import("express").NextFunction) => void;
    createImage: (req: Request, res: Response, next: import("express").NextFunction) => void;
    getAllImages: (req: Request, res: Response, next: import("express").NextFunction) => void;
    getImagesBySubCategory: (req: Request, res: Response, next: import("express").NextFunction) => void;
    getSingleImage: (req: Request, res: Response, next: import("express").NextFunction) => void;
    updateImage: (req: Request, res: Response, next: import("express").NextFunction) => void;
    deleteImage: (req: Request, res: Response, next: import("express").NextFunction) => void;
};
//# sourceMappingURL=gallery.controller.d.ts.map