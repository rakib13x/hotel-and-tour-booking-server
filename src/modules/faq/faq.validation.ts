import { z } from "zod";

// FAQ validation schemas
export const createFaqZodSchema = z.object({
  body: z.object({
    question: z
      .string()
      .min(1, "Question is required")
      .min(5, "Question must be at least 5 characters")
      .max(500, "Question must not exceed 500 characters")
      .trim(),
    answer: z
      .string()
      .min(1, "Answer is required")
      .min(10, "Answer must be at least 10 characters")
      .max(2000, "Answer must not exceed 2000 characters")
      .trim(),
    orderIndex: z
      .number()
      .int("Order index must be an integer")
      .min(0, "Order index must be non-negative")
      .optional(),
    isActive: z.boolean().optional(),
  }),
});

export const updateFaqZodSchema = z.object({
  body: z.object({
    question: z
      .string()
      .min(1, "Question is required")
      .min(5, "Question must be at least 5 characters")
      .max(500, "Question must not exceed 500 characters")
      .trim()
      .optional(),
    answer: z
      .string()
      .min(1, "Answer is required")
      .min(10, "Answer must be at least 10 characters")
      .max(2000, "Answer must not exceed 2000 characters")
      .trim()
      .optional(),
    orderIndex: z
      .number()
      .int("Order index must be an integer")
      .min(0, "Order index must be non-negative")
      .optional(),
    isActive: z.boolean().optional(),
  }),
});

export const faqIdZodSchema = z.object({
  params: z.object({
    id: z
      .string()
      .min(1, "FAQ ID is required")
      .regex(/^[0-9a-fA-F]{24}$/, "Invalid FAQ ID format"),
  }),
});

export const reorderFaqsZodSchema = z.object({
  body: z.object({
    faqs: z
      .array(
        z.object({
          id: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid FAQ ID format"),
          orderIndex: z.number().int().min(0),
        })
      )
      .min(1, "At least one FAQ is required for reordering"),
  }),
});

export const FaqValidation = {
  createFaqZodSchema,
  updateFaqZodSchema,
  faqIdZodSchema,
  reorderFaqsZodSchema,
};
