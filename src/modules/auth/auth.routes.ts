import express from "express";
import passport from "passport";
import { registerValidation } from "./auth.validation";
import validateRequest from "../../middlewares/validateRequest";
import AuthController from "./auth.controller";

const router = express.Router();

router.post(
  "/register",
  registerValidation,
  validateRequest,
  AuthController.register,
);

router.post("/login", AuthController.login);

export default router;
