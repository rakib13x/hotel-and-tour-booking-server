import express from "express";
import adminMiddleware from "../../middlewares/adminMiddleware";
import authMiddleware from "../../middlewares/authMiddleware";
import validateRequest from "../../middlewares/zodValidation";
import CustomTourQueryController from "./customTourQuery.controller";
import {
  zCreateCustomTourQuery,
  zUpdateCustomTourQuery,
} from "./customTourQuery.validation";

const router = express.Router();

// Public routes
router.post(
  "/",
  validateRequest(zCreateCustomTourQuery),
  CustomTourQueryController.createCustomTourQuery
);

// Protected routes (Admin only)
router.use(authMiddleware);
router.use(adminMiddleware);

router.get("/", CustomTourQueryController.getCustomTourQueries);
router.get("/stats", CustomTourQueryController.getCustomTourQueryStats);
router.get("/:id", CustomTourQueryController.getCustomTourQueryById);
router.put(
  "/:id",
  validateRequest(zUpdateCustomTourQuery),
  CustomTourQueryController.updateCustomTourQuery
);
router.delete("/:id", CustomTourQueryController.deleteCustomTourQuery);

export default router;
