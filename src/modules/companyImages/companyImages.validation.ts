import { z } from "zod";

const createCompanyImagesZodSchema = z.object({
  body: z.object({
    affiliation: z
      .array(z.string())
      .min(1, "At least one affiliation image is required"),
    paymentAccept: z
      .array(z.string())
      .min(1, "At least one payment accept image is required"),
  }),
});

const updateCompanyImagesZodSchema = z.object({
  body: z.object({
    affiliation: z.array(z.string()).optional(),
    paymentAccept: z.array(z.string()).optional(),
  }),
});

// Validation for delete specific image operations
const deleteImageZodSchema = z.object({
  body: z.object({
    imageUrl: z.string().min(1, "Image URL is required"),
  }),
});

export const CompanyImagesValidation = {
  createCompanyImagesZodSchema,
  updateCompanyImagesZodSchema,
  deleteImageZodSchema,
};
