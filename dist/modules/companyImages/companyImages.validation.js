"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompanyImagesValidation = void 0;
const zod_1 = require("zod");
const createCompanyImagesZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        affiliation: zod_1.z
            .array(zod_1.z.string())
            .min(1, "At least one affiliation image is required"),
        paymentAccept: zod_1.z
            .array(zod_1.z.string())
            .min(1, "At least one payment accept image is required"),
    }),
});
const updateCompanyImagesZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        affiliation: zod_1.z.array(zod_1.z.string()).optional(),
        paymentAccept: zod_1.z.array(zod_1.z.string()).optional(),
    }),
});
// Validation for delete specific image operations
const deleteImageZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        imageUrl: zod_1.z.string().min(1, "Image URL is required"),
    }),
});
exports.CompanyImagesValidation = {
    createCompanyImagesZodSchema,
    updateCompanyImagesZodSchema,
    deleteImageZodSchema,
};
//# sourceMappingURL=companyImages.validation.js.map