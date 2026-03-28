"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompanyInfoRoutes = void 0;
const express_1 = __importDefault(require("express"));
const user_1 = require("../../enums/user");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const upload_1 = require("../../middlewares/upload");
const companyInfo_controller_1 = require("./companyInfo.controller");
const router = express_1.default.Router();
// Public routes
router.get("/", companyInfo_controller_1.CompanyInfoController.getAllCompanyInfo);
router.get("/:id", companyInfo_controller_1.CompanyInfoController.getCompanyInfo);
// Admin/Super Admin only routes
router.post("/", (0, auth_1.default)([user_1.USER_ROLES.ADMIN, user_1.USER_ROLES.SUPER_ADMIN]), upload_1.uploadCompany.single("logo"), companyInfo_controller_1.CompanyInfoController.createCompanyInfo);
router.patch("/:id", (0, auth_1.default)([user_1.USER_ROLES.ADMIN, user_1.USER_ROLES.SUPER_ADMIN]), upload_1.uploadCompany.single("logo"), (req, res, next) => {
    console.log("=== MULTER MIDDLEWARE DEBUG ===");
    console.log("File received:", req.file);
    console.log("Files received:", req.files);
    console.log("Body:", req.body);
    console.log("================================");
    next();
}, companyInfo_controller_1.CompanyInfoController.updateCompanyInfo);
router.delete("/:id", (0, auth_1.default)([user_1.USER_ROLES.ADMIN, user_1.USER_ROLES.SUPER_ADMIN]), companyInfo_controller_1.CompanyInfoController.deleteCompanyInfo);
exports.CompanyInfoRoutes = router;
//# sourceMappingURL=companyInfo.routes.js.map