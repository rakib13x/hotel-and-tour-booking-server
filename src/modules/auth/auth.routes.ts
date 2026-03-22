import express from "express";
import passport from "passport";
import validateRequest from "../../middlewares/validateRequest";
import AuthController from "./auth.controller";
import authMiddleware from "../../middlewares/authMiddleware";
import { uploadProfileSingle } from "../../middlewares/upload";
import {
  changePasswordValidation,
  registerValidation,
  updateProfileValidation,
} from "./auth.validation";

const router = express.Router();

router.post(
  "/register",
  registerValidation,
  validateRequest,
  AuthController.register,
);

router.post("/login", AuthController.login);

router.patch(
  "/update-profile",
  authMiddleware,
  updateProfileValidation,
  validateRequest,
  AuthController.updateProfile,
);

router.patch(
  "/change-password",
  authMiddleware,
  changePasswordValidation,
  validateRequest,
  AuthController.changePassword,
);

router.patch(
  "/upload-profile-image",
  authMiddleware,
  uploadProfileSingle,
  AuthController.uploadProfileImage,
);

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  }),
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login",
    session: false,
  }),
  AuthController.googleCallback,
);

export default router;
