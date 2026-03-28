import { Request, Response } from "express";
export declare const BlogController: {
    createBlog: (req: Request, res: Response, next: import("express").NextFunction) => void;
    getAllBlogs: (req: Request, res: Response, next: import("express").NextFunction) => void;
    getSingleBlog: (req: Request, res: Response, next: import("express").NextFunction) => void;
    updateBlog: (req: Request, res: Response, next: import("express").NextFunction) => void;
    deleteBlog: (req: Request, res: Response, next: import("express").NextFunction) => void;
    getBlogStats: (req: Request, res: Response, next: import("express").NextFunction) => void;
    getAllCategories: (req: Request, res: Response, next: import("express").NextFunction) => void;
    createCategory: (req: Request, res: Response, next: import("express").NextFunction) => void;
    getSingleCategory: (req: Request, res: Response, next: import("express").NextFunction) => void;
    updateCategory: (req: Request, res: Response, next: import("express").NextFunction) => void;
    deleteCategory: (req: Request, res: Response, next: import("express").NextFunction) => void;
};
//# sourceMappingURL=blogs.controller.d.ts.map