"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const adminMiddleware_1 = __importDefault(require("../../middlewares/adminMiddleware"));
const authMiddleware_1 = __importDefault(require("../../middlewares/authMiddleware"));
const upload_1 = require("../../middlewares/upload");
const tourCategory_controller_1 = __importDefault(require("./tourCategory.controller"));
const router = express_1.default.Router();
// Public routes
router.get("/active", tourCategory_controller_1.default.getAllActiveTourCategories);
router.get("/:id", tourCategory_controller_1.default.getTourCategoryById);
router.get("/", tourCategory_controller_1.default.getTourCategories);
// Protected routes (Admin only)
router.post("/", authMiddleware_1.default, adminMiddleware_1.default, tourCategory_controller_1.default.createTourCategory);
router.post("/with-image", authMiddleware_1.default, adminMiddleware_1.default, upload_1.uploadTourCategorySingle, tourCategory_controller_1.default.createTourCategoryWithImage);
router.put("/:id", authMiddleware_1.default, adminMiddleware_1.default, tourCategory_controller_1.default.updateTourCategory);
router.put("/:id/with-image", authMiddleware_1.default, adminMiddleware_1.default, upload_1.uploadTourCategorySingle, tourCategory_controller_1.default.updateTourCategoryWithImage);
router.delete("/:id", authMiddleware_1.default, adminMiddleware_1.default, tourCategory_controller_1.default.deleteTourCategory);
exports.default = router;
//# sourceMappingURL=tourCategory.routes.js.map