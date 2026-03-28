import { z } from "zod";

// Create custom tour query validation
const createCustomTourQueryValidation = z.object({
  name: z
    .string()
    .min(1, { message: "Name is required" })
    .max(100, { message: "Name cannot exceed 100 characters" })
    .trim(),

  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email({ message: "Please provide a valid email address" })
    .toLowerCase()
    .trim(),

  phone: z
    .string()
    .min(1, { message: "Phone number is required" })
    .max(20, { message: "Phone number cannot exceed 20 characters" })
    .trim(),

  tourId: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, {
      message: "Invalid tour ID format",
    })
    .optional(),

  tourTitle: z
    .string()
    .max(200, {
      message: "Tour title cannot exceed 200 characters",
    })
    .trim()
    .optional(),
});

// Update custom tour query validation
const updateCustomTourQueryValidation = z.object({
  name: z
    .string()
    .min(1, { message: "Name is required" })
    .max(100, { message: "Name cannot exceed 100 characters" })
    .trim()
    .optional(),

  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email({ message: "Please provide a valid email address" })
    .toLowerCase()
    .trim()
    .optional(),

  phone: z
    .string()
    .min(1, { message: "Phone number is required" })
    .max(20, { message: "Phone number cannot exceed 20 characters" })
    .trim()
    .optional(),

  status: z
    .enum(["pending", "contacted", "closed"], {
      message: "Status must be one of: pending, contacted, closed",
    })
    .optional(),
});

export const zCreateCustomTourQuery = z.object({
  body: createCustomTourQueryValidation,
});

export const zUpdateCustomTourQuery = z.object({
  body: updateCustomTourQueryValidation,
});
