import { z } from "zod";

// Create team (form-data) - validates full request structure
export const createTeamValidation = z.object({
  params: z.object({}).optional(),
  query: z.object({}).optional(),
  body: z.object({
    name: z
      .string()
      .min(1, { message: "Name is required" })
      .max(100, { message: "Name cannot exceed 100 characters" }),
    designation: z
      .string()
      .min(1, { message: "Designation is required" })
      .max(100, { message: "Designation cannot exceed 100 characters" }),
  }),
});

// Create team with image URL (JSON) - validates request body
export const createTeamWithUrlValidation = z.object({
  name: z
    .string()
    .min(1, { message: "Name is required" })
    .max(100, { message: "Name cannot exceed 100 characters" }),
  designation: z
    .string()
    .min(1, { message: "Designation is required" })
    .max(100, { message: "Designation cannot exceed 100 characters" }),
  image: z
    .string()
    .min(1, { message: "Image URL cannot be empty" })
    .url({ message: "Please provide a valid image URL" }),
});

// Update team - validates request body
export const updateTeamValidation = z.object({
  name: z
    .string()
    .min(1, { message: "Name cannot be empty" })
    .max(100, { message: "Name cannot exceed 100 characters" })
    .optional(),
  designation: z
    .string()
    .min(1, { message: "Designation cannot be empty" })
    .max(100, { message: "Designation cannot exceed 100 characters" })
    .optional(),
  image: z
    .string()
    .min(1, { message: "Image URL cannot be empty" })
    .url({ message: "Please provide a valid image URL" })
    .optional(),
});

// Update team with image - validates full request structure
export const updateTeamWithImageValidation = z.object({
  params: z.object({
    id: z
      .string()
      .min(1, { message: "Team ID is required" })
      .regex(/^[0-9a-fA-F]{24}$/, { message: "Invalid team ID format" }),
  }),
  query: z.object({}).optional(),
  body: z.object({
    name: z
      .string()
      .min(1, { message: "Name cannot be empty" })
      .max(100, { message: "Name cannot exceed 100 characters" })
      .optional(),
    designation: z
      .string()
      .min(1, { message: "Designation cannot be empty" })
      .max(100, { message: "Designation cannot exceed 100 characters" })
      .optional(),
  }),
});

// ID parameter validation for routes
export const idParamValidation = z.object({
  id: z
    .string()
    .min(1, { message: "Team ID is required" })
    .regex(/^[0-9a-fA-F]{24}$/, { message: "Invalid team ID format" }),
});

// Reorder team members validation
export const reorderTeamsValidation = z.object({
  teamIds: z
    .array(
      z
        .string()
        .regex(/^[0-9a-fA-F]{24}$/, { message: "Invalid team ID format" })
    )
    .min(1, { message: "At least one team ID is required" })
    .max(100, { message: "Too many team members to reorder" }),
});
