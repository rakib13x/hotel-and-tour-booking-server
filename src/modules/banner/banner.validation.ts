import { z } from "zod";

// Create banner (form-data) - validates request body directly
const createBannerValidation = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  backgroundImage: z.string().url("Invalid image URL").optional(),
});

// Create banner with JSON - validates request body wrapped in body object
const createBannerWithJsonValidation = z.object({
  body: z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().min(1, "Description is required"),
    backgroundImage: z.string().url("Invalid image URL").optional(),
  }),
});

// Update banner (form-data) - validates request body directly
const updateBannerValidation = z.object({
  title: z.string().min(1, "Title is required").optional(),
  description: z.string().min(1, "Description is required").optional(),
  backgroundImage: z.string().url("Invalid image URL").optional(),
});

// Update banner with JSON - validates request body wrapped in body object
const updateBannerWithJsonValidation = z.object({
  body: z.object({
    title: z.string().min(1, "Title is required").optional(),
    description: z.string().min(1, "Description is required").optional(),
    backgroundImage: z.string().url("Invalid image URL").optional(),
  }),
});

const getSingleBannerValidation = z.object({
  params: z.object({
    id: z.string().min(1, "Banner ID is required"),
  }),
});

const deleteBannerValidation = z.object({
  params: z.object({
    id: z.string().min(1, "Banner ID is required"),
  }),
});

export const BannerValidation = {
  createBannerValidation,
  createBannerWithJsonValidation,
  updateBannerValidation,
  updateBannerWithJsonValidation,
  getSingleBannerValidation,
  deleteBannerValidation,
};
