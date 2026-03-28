"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompanyImagesRoutes = void 0;
const express_1 = __importDefault(require("express"));
const user_1 = require("../../enums/user");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const upload_1 = require("../../middlewares/upload");
const companyImages_controller_1 = require("./companyImages.controller");
const router = express_1.default.Router();
// Get all company images (Public)
router.get("/", companyImages_controller_1.CompanyImagesController.getAllCompanyImages);
// Get company images by ID (Public)
router.get("/:id", companyImages_controller_1.CompanyImagesController.getCompanyImages);
// Create company images (Admin/Super Admin only)
router.post("/", (0, auth_1.default)([user_1.USER_ROLES.ADMIN, user_1.USER_ROLES.SUPER_ADMIN]), upload_1.uploadCompanyFields, companyImages_controller_1.CompanyImagesController.createCompanyImages);
// Update company images (Admin/Super Admin only)
router.patch("/:id", (0, auth_1.default)([user_1.USER_ROLES.ADMIN, user_1.USER_ROLES.SUPER_ADMIN]), upload_1.uploadCompanyFields, companyImages_controller_1.CompanyImagesController.updateCompanyImages);
// Delete company images (Admin/Super Admin only)
router.delete("/:id", (0, auth_1.default)([user_1.USER_ROLES.ADMIN, user_1.USER_ROLES.SUPER_ADMIN]), companyImages_controller_1.CompanyImagesController.deleteCompanyImages);
// Delete specific image from any field (Admin/Super Admin only)
router.delete("/:id/:fieldType", (0, auth_1.default)([user_1.USER_ROLES.ADMIN, user_1.USER_ROLES.SUPER_ADMIN]), companyImages_controller_1.CompanyImagesController.deleteSpecificImage);
exports.CompanyImagesRoutes = router;
//# sourceMappingURL=companyImages.routes.js.map