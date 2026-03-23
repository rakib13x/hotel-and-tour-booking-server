import { z } from "zod";

// Create authorization (form-data) - validates request body directly
const createAuthorizationValidation = z.object({
  image: z.string().optional(),
});

// Create authorization with JSON - validates request body wrapped in body object
const createAuthorizationWithJsonValidation = z.object({
  body: z.object({
    image: z.string().url("Invalid image URL").optional(),
  }),
});

// Update authorization (form-data) - validates request body directly
const updateAuthorizationValidation = z.object({
  image: z.string().optional(),
});

// Update authorization with JSON - validates request body wrapped in body object
const updateAuthorizationWithJsonValidation = z.object({
  body: z.object({
    image: z.string().url("Invalid image URL").optional(),
  }),
});

const getSingleAuthorizationValidation = z.object({
  params: z.object({
    id: z.string().min(1, "Authorization ID is required"),
  }),
});

const deleteAuthorizationValidation = z.object({
  params: z.object({
    id: z.string().min(1, "Authorization ID is required"),
  }),
});

export const AuthorizationValidation = {
  createAuthorizationValidation,
  createAuthorizationWithJsonValidation,
  updateAuthorizationValidation,
  updateAuthorizationWithJsonValidation,
  getSingleAuthorizationValidation,
  deleteAuthorizationValidation,
};
