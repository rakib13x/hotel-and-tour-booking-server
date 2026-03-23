import { z } from "zod";

const createCategoryValidation = z.object({
  body: z.object({
    name: z
      .string()
      .min(2, "Category name must be at least 2 characters long")
      .max(50, "Category name must be less than 50 characters")
      .trim()
      .regex(
        /^[a-zA-Z0-9\s-]+$/,
        "Category name can only contain letters, numbers, spaces, and hyphens"
      )
      .refine(
        (val) => !val.startsWith(" ") && !val.endsWith(" "),
        "Category name cannot start or end with spaces"
      )
      .refine(
        (val) => !val.includes("  "),
        "Category name cannot contain consecutive spaces"
      ),
  }),
});

const updateCategoryValidation = z.object({
  body: z.object({
    name: z
      .string()
      .min(2, "Category name must be at least 2 characters long")
      .max(50, "Category name must be less than 50 characters")
      .trim()
      .regex(
        /^[a-zA-Z0-9\s-]+$/,
        "Category name can only contain letters, numbers, spaces, and hyphens"
      )
      .refine(
        (val) => !val.startsWith(" ") && !val.endsWith(" "),
        "Category name cannot start or end with spaces"
      )
      .refine(
        (val) => !val.includes("  "),
        "Category name cannot contain consecutive spaces"
      )
      .optional(),
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

export const CategoryValidation = {
  createCategoryValidation,
  updateCategoryValidation,
  getSingleCategoryValidation,
  deleteCategoryValidation,
};
