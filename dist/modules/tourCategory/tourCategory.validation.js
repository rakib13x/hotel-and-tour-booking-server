"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tourCategoryIdSchema = exports.updateTourCategorySchema = exports.createTourCategorySchema = void 0;
const zod_1 = require("zod");
exports.createTourCategorySchema = zod_1.z.object({
    body: zod_1.z.object({
        category_name: zod_1.z.string().min(2, "Category name must be at least 2 characters"),
        description: zod_1.z.string().optional(),
    }),
});
exports.updateTourCategorySchema = zod_1.z.object({
    body: zod_1.z.object({
        category_name: zod_1.z.string().min(2, "Category name must be at least 2 characters").optional(),
        description: zod_1.z.string().optional(),
    }),
});
exports.tourCategoryIdSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid tour category ID"),
    }),
});
//# sourceMappingURL=tourCategory.validation.js.map