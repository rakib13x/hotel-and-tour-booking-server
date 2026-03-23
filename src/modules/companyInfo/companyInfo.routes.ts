import express from "express";
import { USER_ROLES } from "../../enums/user";
import auth from "../../middlewares/auth";
import { uploadCompany } from "../../middlewares/upload";
import { CompanyInfoController } from "./companyInfo.controller";

const router = express.Router();

// Public routes
router.get("/", CompanyInfoController.getAllCompanyInfo);
router.get("/:id", CompanyInfoController.getCompanyInfo);

// Admin/Super Admin only routes
router.post(
  "/",
  auth([USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN]),
  uploadCompany.single("logo"),
  CompanyInfoController.createCompanyInfo
);

router.patch(
  "/:id",
  auth([USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN]),
  uploadCompany.single("logo"),
  (req, res, next) => {
    console.log("=== MULTER MIDDLEWARE DEBUG ===");
    console.log("File received:", req.file);
    console.log("Files received:", req.files);
    console.log("Body:", req.body);
    console.log("================================");
    next();
  },
  CompanyInfoController.updateCompanyInfo
);

router.delete(
  "/:id",
  auth([USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN]),
  CompanyInfoController.deleteCompanyInfo
);

export const CompanyInfoRoutes = router;
