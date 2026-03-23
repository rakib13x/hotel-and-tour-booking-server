import { Router } from "express";
import { z } from "zod";

import authMiddleware from "../../middlewares/authMiddleware";
import adminController from "./admin.controller";
import adminMiddleware from "../../middlewares/adminMiddleware";

const router = Router();

// Validation schemas
const createUserSchema = z.object({
  body: z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email format"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    role: z.enum(["admin", "user", "super_admin"]).optional(),
  }),
});

const updateUserSchema = z.object({
  body: z.object({
    name: z.string().min(1, "Name is required").optional(),
    email: z.string().email("Invalid email format").optional(),
    role: z.enum(["admin", "user", "super_admin"]).optional(),
  }),
});

const changeRoleSchema = z.object({
  body: z.object({
    role: z.enum(["admin", "user", "super_admin"]),
  }),
});

// All admin routes require authentication and admin privileges
router.use(authMiddleware);
router.use(adminMiddleware);

// User management routes
router.get("/users", adminController.getAllUsers);

export default router;
