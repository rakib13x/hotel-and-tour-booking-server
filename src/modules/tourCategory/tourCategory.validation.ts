import { z } from "zod";

export const createTourCategorySchema = z.object({
  body: z.object({
    category_name: z.string().min(2, "Category name must be at least 2 characters"),
    description: z.string().optional(),
  }),
});

export const updateTourCategorySchema = z.object({
  body: z.object({
    category_name: z.string().min(2, "Category name must be at least 2 characters").optional(),
    description: z.string().optional(),
  }),
});

export const tourCategoryIdSchema = z.object({
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid tour category ID"),
  }),
});
