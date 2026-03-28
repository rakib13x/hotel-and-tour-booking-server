"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GalleryValidation = void 0;
const zod_1 = require("zod");
// Category validations
const createCategoryValidation = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z
            .string()
            .min(1, "Category name is required")
            .max(100, "Category name must be less than 100 characters")
            .trim(),
        image: zod_1.z.string().trim().min(1, "Category image is required"),
        isActive: zod_1.z.boolean().optional().default(true),
    }),
});
const updateCategoryValidation = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z
            .string()
            .min(1, "Category name is required")
            .max(100, "Category name must be less than 100 characters")
            .trim()
            .optional(),
        image: zod_1.z.string().trim().min(1, "Category image is required").optional(),
        isActive: zod_1.z.boolean().optional(),
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
// SubCategory validations
const createSubCategoryValidation = zod_1.z.object({
    body: zod_1.z.object({
        categoryId: zod_1.z.string().min(1, "Category ID is required"),
        name: zod_1.z
            .string()
            .min(1, "SubCategory name is required")
            .max(100, "SubCategory name must be less than 100 characters")
            .trim(),
        image: zod_1.z.string().trim().min(1, "SubCategory image is required"),
        isActive: zod_1.z.boolean().optional().default(true),
    }),
});
const updateSubCategoryValidation = zod_1.z.object({
    body: zod_1.z.object({
        categoryId: zod_1.z.string().min(1, "Category ID is required").optional(),
        name: zod_1.z
            .string()
            .min(1, "SubCategory name is required")
            .max(100, "SubCategory name must be less than 100 characters")
            .trim()
            .optional(),
        image: zod_1.z.string().trim().min(1, "SubCategory image is required").optional(),
        isActive: zod_1.z.boolean().optional(),
    }),
});
const getSingleSubCategoryValidation = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().min(1, "SubCategory ID is required"),
    }),
});
const deleteSubCategoryValidation = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().min(1, "SubCategory ID is required"),
    }),
});
const getSubCategoriesByCategoryValidation = zod_1.z.object({
    params: zod_1.z.object({
        categoryId: zod_1.z.string().min(1, "Category ID is required"),
    }),
});
// Image validations
// For form-data requests (file uploads)
const createImageValidation = zod_1.z.object({
    body: zod_1.z.object({
        subCategoryId: zod_1.z.string().min(1, "SubCategory ID is required"),
        altText: zod_1.z
            .string()
            .max(200, "Alt text must be less than 200 characters")
            .trim()
            .optional(),
        isActive: zod_1.z.boolean().optional().default(true),
    }),
});
const updateImageValidation = zod_1.z.object({
    body: zod_1.z.object({
        subCategoryId: zod_1.z.string().min(1, "SubCategory ID is required").optional(),
        url: zod_1.z
            .string()
            .min(1, "Image URL is required")
            .url("Please provide a valid URL")
            .optional(),
        altText: zod_1.z
            .string()
            .max(200, "Alt text must be less than 200 characters")
            .trim()
            .optional(),
        isActive: zod_1.z.boolean().optional(),
    }),
});
const getSingleImageValidation = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().min(1, "Image ID is required"),
    }),
});
const deleteImageValidation = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().min(1, "Image ID is required"),
    }),
});
const getImagesBySubCategoryValidation = zod_1.z.object({
    params: zod_1.z.object({
        subCategoryId: zod_1.z.string().min(1, "SubCategory ID is required"),
    }),
});
exports.GalleryValidation = {
    // Category validations
    createCategoryValidation,
    updateCategoryValidation,
    getSingleCategoryValidation,
    deleteCategoryValidation,
    // SubCategory validations
    createSubCategoryValidation,
    updateSubCategoryValidation,
    getSingleSubCategoryValidation,
    deleteSubCategoryValidation,
    getSubCategoriesByCategoryValidation,
    // Image validations
    createImageValidation,
    updateImageValidation,
    getSingleImageValidation,
    deleteImageValidation,
    getImagesBySubCategoryValidation,
};
//# sourceMappingURL=gallery.validation.js.map