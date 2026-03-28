"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BannerValidation = void 0;
const zod_1 = require("zod");
// Create banner (form-data) - validates request body directly
const createBannerValidation = zod_1.z.object({
    title: zod_1.z.string().min(1, "Title is required"),
    description: zod_1.z.string().min(1, "Description is required"),
    backgroundImage: zod_1.z.string().url("Invalid image URL").optional(),
});
// Create banner with JSON - validates request body wrapped in body object
const createBannerWithJsonValidation = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string().min(1, "Title is required"),
        description: zod_1.z.string().min(1, "Description is required"),
        backgroundImage: zod_1.z.string().url("Invalid image URL").optional(),
    }),
});
// Update banner (form-data) - validates request body directly
const updateBannerValidation = zod_1.z.object({
    title: zod_1.z.string().min(1, "Title is required").optional(),
    description: zod_1.z.string().min(1, "Description is required").optional(),
    backgroundImage: zod_1.z.string().url("Invalid image URL").optional(),
});
// Update banner with JSON - validates request body wrapped in body object
const updateBannerWithJsonValidation = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string().min(1, "Title is required").optional(),
        description: zod_1.z.string().min(1, "Description is required").optional(),
        backgroundImage: zod_1.z.string().url("Invalid image URL").optional(),
    }),
});
const getSingleBannerValidation = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().min(1, "Banner ID is required"),
    }),
});
const deleteBannerValidation = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().min(1, "Banner ID is required"),
    }),
});
exports.BannerValidation = {
    createBannerValidation,
    createBannerWithJsonValidation,
    updateBannerValidation,
    updateBannerWithJsonValidation,
    getSingleBannerValidation,
    deleteBannerValidation,
};
//# sourceMappingURL=banner.validation.js.map