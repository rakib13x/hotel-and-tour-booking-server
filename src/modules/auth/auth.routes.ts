import express from "express";
import passport from "passport";
import { registerValidation } from "./auth.validation";
import validateRequest from "../../middlewares/validateRequest";
import authController from "./auth.controller";

const router = express.Router();

router.post(
  "/register",
  registerValidation,
  validateRequest,
  authController.register,
);

export default router;
