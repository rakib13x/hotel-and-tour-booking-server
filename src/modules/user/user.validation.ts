import { z } from "zod";

const createUserValidation = z.object({
  body: z.object({
    name: z.string().min(1, "Name is required").optional(),
    email: z.string().email("Invalid email format"),
    phone: z
      .string()
      .min(10, "Phone number must be at least 10 characters")
      .optional(),
    profileImg: z.string().url("Invalid profile image URL").optional(),
    password: z.string().min(8, "Password must be at least 8 characters"),
    status: z.enum(["active", "block", "deactive"]).optional(),
    role: z.enum(["user", "admin", "super_admin"]).optional(),
  }),
});

const updateUserValidation = z.object({
  body: z.object({
    name: z.string().min(1, "Name is required").optional(),
    email: z.string().email("Invalid email format").optional(),
    phone: z
      .string()
      .min(10, "Phone number must be at least 10 characters")
      .optional(),
    profileImg: z.string().url("Invalid profile image URL").optional(),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .optional(),
    status: z.enum(["active", "block", "deactive"]).optional(),
    role: z.enum(["user", "admin", "super_admin"]).optional(),
  }),
});

const getUserValidation = z.object({
  params: z.object({
    id: z.string().min(1, "User ID is required"),
  }),
});

const deleteUserValidation = z.object({
  params: z.object({
    id: z.string().min(1, "User ID is required"),
  }),
});

const changeUserStatusValidation = z.object({
  params: z.object({
    id: z.string().min(1, "User ID is required"),
  }),
  body: z.object({
    status: z.enum(["active", "block", "deactive"]),
  }),
});

const changeUserRoleValidation = z.object({
  params: z.object({
    id: z.string().min(1, "User ID is required"),
  }),
  body: z.object({
    role: z.enum(["user", "admin", "super_admin"]),
  }),
});

export {
  changeUserRoleValidation,
  changeUserStatusValidation,
  createUserValidation,
  deleteUserValidation,
  getUserValidation,
  updateUserValidation,
};
