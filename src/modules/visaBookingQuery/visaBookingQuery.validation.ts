import { z } from "zod";

// Create visa booking query validation
const createVisaBookingQueryValidation = z.object({
  country: z
    .string()
    .min(1, { message: "Country is required" })
    .max(100, { message: "Country name cannot exceed 100 characters" })
    .trim(),

  visaType: z
    .string()
    .min(1, { message: "Visa type is required" })
    .max(100, { message: "Visa type cannot exceed 100 characters" })
    .trim(),

  name: z
    .string()
    .min(1, { message: "Name is required" })
    .min(2, { message: "Name must be at least 2 characters" })
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
    .min(10, { message: "Phone number must be at least 10 digits" })
    .max(20, { message: "Phone number cannot exceed 20 characters" })
    .trim(),
});

// Update visa booking query validation (mainly for status update)
const updateVisaBookingQueryValidation = z.object({
  status: z.enum(["pending", "contacted", "closed"], {
    message: "Status must be one of: pending, contacted, closed",
  }),
});

export const zCreateVisaBookingQuery = z.object({
  body: createVisaBookingQueryValidation,
});

export const zUpdateVisaBookingQuery = z.object({
  body: updateVisaBookingQueryValidation,
});
