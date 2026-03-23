import { Router } from "express";
import UserController from "./user.controller";
import authMiddleware from "../../middlewares/authMiddleware";
import adminMiddleware from "../../middlewares/adminMiddleware";
import validateRequest from "../../middlewares/zodValidation";
import {
  createUserValidation,
  updateUserValidation,
  getUserValidation,
  deleteUserValidation,
  changeUserStatusValidation,
  changeUserRoleValidation,
} from "./user.validation";

const router = Router();

// All routes require authentication
router.use(authMiddleware);

// Admin-only routes
router.post(
  "/",
  adminMiddleware,
  validateRequest(createUserValidation),
  UserController.createUser
);

router.get(
  "/stats",
  adminMiddleware,
  UserController.getUserStats
);

router.patch(
  "/:id/status",
  adminMiddleware,
  validateRequest(changeUserStatusValidation),
  UserController.changeUserStatus
);

router.patch(
  "/:id/role",
  adminMiddleware,
  validateRequest(changeUserRoleValidation),
  UserController.changeUserRole
);

// Admin and user routes
router.get(
  "/",
  adminMiddleware,
  UserController.getAllUsers
);

router.get(
  "/:id",
  adminMiddleware,
  validateRequest(getUserValidation),
  UserController.getSingleUser
);

router.patch(
  "/:id",
  adminMiddleware,
  validateRequest(updateUserValidation),
  UserController.updateUser
);

router.delete(
  "/:id",
  adminMiddleware,
  validateRequest(deleteUserValidation),
  UserController.deleteUser
);

export default router;