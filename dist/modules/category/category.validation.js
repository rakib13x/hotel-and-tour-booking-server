"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.categoryIdSchema = exports.updateCategorySchema = exports.createCategorySchema = void 0;
const zod_1 = require("zod");
exports.createCategorySchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().min(2, "Category name must be at least 2 characters"),
        slug: zod_1.z
            .string()
            .min(2, "Slug must be at least 2 characters")
            .regex(/^[a-z0-9-]+$/, "Slug must be lowercase with hyphens only"),
        description: zod_1.z.string().optional(),
        isActive: zod_1.z.boolean().optional(),
        sortOrder: zod_1.z.number().int().optional(),
    }),
});
exports.updateCategorySchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z
            .string()
            .min(2, "Category name must be at least 2 characters")
            .optional(),
        slug: zod_1.z
            .string()
            .min(2, "Slug must be at least 2 characters")
            .regex(/^[a-z0-9-]+$/, "Slug must be lowercase with hyphens only")
            .optional(),
        description: zod_1.z.string().optional(),
        isActive: zod_1.z.boolean().optional(),
        sortOrder: zod_1.z.number().int().optional(),
    }),
});
exports.categoryIdSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid category ID"),
    }),
});
//# sourceMappingURL=category.validation.js.map