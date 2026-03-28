"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryValidation = void 0;
const zod_1 = require("zod");
const createCategoryValidation = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z
            .string()
            .min(2, "Category name must be at least 2 characters long")
            .max(50, "Category name must be less than 50 characters")
            .trim()
            .regex(/^[a-zA-Z0-9\s-]+$/, "Category name can only contain letters, numbers, spaces, and hyphens")
            .refine((val) => !val.startsWith(" ") && !val.endsWith(" "), "Category name cannot start or end with spaces")
            .refine((val) => !val.includes("  "), "Category name cannot contain consecutive spaces"),
    }),
});
const updateCategoryValidation = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z
            .string()
            .min(2, "Category name must be at least 2 characters long")
            .max(50, "Category name must be less than 50 characters")
            .trim()
            .regex(/^[a-zA-Z0-9\s-]+$/, "Category name can only contain letters, numbers, spaces, and hyphens")
            .refine((val) => !val.startsWith(" ") && !val.endsWith(" "), "Category name cannot start or end with spaces")
            .refine((val) => !val.includes("  "), "Category name cannot contain consecutive spaces")
            .optional(),
    }),
});
const getSingleCategoryValidation = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().min(1, "Category ID is required"),
    }),
});
const deleteCategoryValidation = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().min(1, "Category ID is required"),
    }),
});
exports.CategoryValidation = {
    createCategoryValidation,
    updateCategoryValidation,
    getSingleCategoryValidation,
    deleteCategoryValidation,
};
//# sourceMappingURL=category.validation.js.map