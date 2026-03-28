"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlogValidation = void 0;
const zod_1 = require("zod");
const createBlogValidation = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string().min(1, "Title is required"),
        categoryName: zod_1.z.string().min(1, "Category name is required"),
        coverImage: zod_1.z.string().optional(), // Made optional since it will be added by controller
        images: zod_1.z.array(zod_1.z.string()).optional(),
        content: zod_1.z.string().min(1, "Content is required"),
        tags: zod_1.z.union([
            zod_1.z.array(zod_1.z.string()).min(1, "At least one tag is required"),
            zod_1.z.string().transform((str) => {
                try {
                    const parsed = JSON.parse(str);
                    return Array.isArray(parsed) ? parsed : [str];
                }
                catch {
                    return [str];
                }
            }),
        ]),
        readTime: zod_1.z.string().min(1, "Read time is required"),
        status: zod_1.z.enum(["draft", "published"]).default("draft"),
        featured: zod_1.z
            .union([
            zod_1.z.boolean(),
            zod_1.z.string().transform((val) => val === "true" || val === "1"),
            zod_1.z
                .string()
                .optional()
                .transform((val) => val === "true" || val === "1"),
        ])
            .optional(),
    }),
});
const updateBlogValidation = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string().min(1, "Title is required").optional(),
        categoryName: zod_1.z.string().min(1, "Category name is required").optional(),
        coverImage: zod_1.z.string().optional(),
        images: zod_1.z.array(zod_1.z.string()).optional(),
        content: zod_1.z.string().min(1, "Content is required").optional(),
        tags: zod_1.z
            .union([
            zod_1.z.array(zod_1.z.string()).min(1, "At least one tag is required"),
            zod_1.z.string().transform((str) => {
                try {
                    const parsed = JSON.parse(str);
                    return Array.isArray(parsed) ? parsed : [str];
                }
                catch {
                    return [str];
                }
            }),
        ])
            .optional(),
        readTime: zod_1.z.string().min(1, "Read time is required").optional(),
        status: zod_1.z.enum(["draft", "published"]).optional(),
        featured: zod_1.z
            .union([
            zod_1.z.boolean(),
            zod_1.z.string().transform((val) => val === "true" || val === "1"),
            zod_1.z
                .string()
                .optional()
                .transform((val) => val === "true" || val === "1"),
        ])
            .optional(),
    }),
});
const getSingleBlogValidation = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().min(1, "Blog ID is required"),
    }),
});
const deleteBlogValidation = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().min(1, "Blog ID is required"),
    }),
});
exports.BlogValidation = {
    createBlogValidation,
    updateBlogValidation,
    getSingleBlogValidation,
    deleteBlogValidation,
};
//# sourceMappingURL=blogs.validation.js.map