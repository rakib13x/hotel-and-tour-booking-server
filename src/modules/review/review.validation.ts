import { z } from "zod";

// We validate the full request structure to match project's zodValidation middleware
const createReviewSchema = z.object({
  params: z.object({}).optional(),
  query: z.object({}).optional(),
  body: z.object({
    userName: z.string({ message: "User name is required" }).min(1),
    userProfileImg: z.string().optional(),
    designation: z.string().optional().default("Traveller"),
    rating: z.coerce
      .number({ message: "Rating must be a valid number" })
      .min(1)
      .max(5),
    comment: z.string({ message: "Comment is required" }).min(1),
  }),
});

const updateReviewSchema = z.object({
  params: z.object({
    id: z
      .string()
      .min(1, { message: "ID is required" })
      .regex(/^[0-9a-fA-F]{24}$/, { message: "Invalid ID format" }),
  }),
  query: z.object({}).optional(),
  body: z.object({
    userName: z.string().optional(),
    userProfileImg: z
      .union([z.string(), z.object({}).passthrough()])
      .optional(),
    designation: z.string().optional(),
    rating: z.coerce.number().min(1).max(5).optional(),
    comment: z.string().optional(),
  }),
});

const idParamSchema = z.object({
  id: z
    .string()
    .min(1, { message: "ID is required" })
    .regex(/^[0-9a-fA-F]{24}$/, { message: "Invalid ID format" }),
});

export const ReviewValidation = {
  createReviewSchema,
  updateReviewSchema,
  idParamSchema,
};
