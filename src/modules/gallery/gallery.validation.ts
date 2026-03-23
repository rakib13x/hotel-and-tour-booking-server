import { z } from "zod";

// Category validations
const createCategoryValidation = z.object({
  body: z.object({
    name: z
      .string()
      .min(1, "Category name is required")
      .max(100, "Category name must be less than 100 characters")
      .trim(),
    image: z.string().trim().min(1, "Category image is required"),
    isActive: z.boolean().optional().default(true),
  }),
});

const updateCategoryValidation = z.object({
  body: z.object({
    name: z
      .string()
      .min(1, "Category name is required")
      .max(100, "Category name must be less than 100 characters")
      .trim()
      .optional(),
    image: z.string().trim().min(1, "Category image is required").optional(),
    isActive: z.boolean().optional(),
  }),
});

const getSingleCategoryValidation = z.object({
  params: z.object({
    id: z.string().min(1, "Category ID is required"),
  }),
});

const deleteCategoryValidation = z.object({
  params: z.object({
    id: z.string().min(1, "Category ID is required"),
  }),
});

// SubCategory validations
const createSubCategoryValidation = z.object({
  body: z.object({
    categoryId: z.string().min(1, "Category ID is required"),
    name: z
      .string()
      .min(1, "SubCategory name is required")
      .max(100, "SubCategory name must be less than 100 characters")
      .trim(),
    image: z.string().trim().min(1, "SubCategory image is required"),
    isActive: z.boolean().optional().default(true),
  }),
});

const updateSubCategoryValidation = z.object({
  body: z.object({
    categoryId: z.string().min(1, "Category ID is required").optional(),
    name: z
      .string()
      .min(1, "SubCategory name is required")
      .max(100, "SubCategory name must be less than 100 characters")
      .trim()
      .optional(),
    image: z.string().trim().min(1, "SubCategory image is required").optional(),
    isActive: z.boolean().optional(),
  }),
});

const getSingleSubCategoryValidation = z.object({
  params: z.object({
    id: z.string().min(1, "SubCategory ID is required"),
  }),
});

const deleteSubCategoryValidation = z.object({
  params: z.object({
    id: z.string().min(1, "SubCategory ID is required"),
  }),
});

const getSubCategoriesByCategoryValidation = z.object({
  params: z.object({
    categoryId: z.string().min(1, "Category ID is required"),
  }),
});

// Image validations
// For form-data requests (file uploads)
const createImageValidation = z.object({
  body: z.object({
    subCategoryId: z.string().min(1, "SubCategory ID is required"),
    altText: z
      .string()
      .max(200, "Alt text must be less than 200 characters")
      .trim()
      .optional(),
    isActive: z.boolean().optional().default(true),
  }),
});

const updateImageValidation = z.object({
  body: z.object({
    subCategoryId: z.string().min(1, "SubCategory ID is required").optional(),
    url: z
      .string()
      .min(1, "Image URL is required")
      .url("Please provide a valid URL")
      .optional(),
    altText: z
      .string()
      .max(200, "Alt text must be less than 200 characters")
      .trim()
      .optional(),
    isActive: z.boolean().optional(),
  }),
});

const getSingleImageValidation = z.object({
  params: z.object({
    id: z.string().min(1, "Image ID is required"),
  }),
});

const deleteImageValidation = z.object({
  params: z.object({
    id: z.string().min(1, "Image ID is required"),
  }),
});

const getImagesBySubCategoryValidation = z.object({
  params: z.object({
    subCategoryId: z.string().min(1, "SubCategory ID is required"),
  }),
});

export const GalleryValidation = {
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
