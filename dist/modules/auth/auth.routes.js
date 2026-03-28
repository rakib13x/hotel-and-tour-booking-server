"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const passport_1 = __importDefault(require("passport"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const auth_controller_1 = __importDefault(require("./auth.controller"));
const authMiddleware_1 = __importDefault(require("../../middlewares/authMiddleware"));
const upload_1 = require("../../middlewares/upload");
const auth_validation_1 = require("./auth.validation");
const router = express_1.default.Router();
router.post("/register", auth_validation_1.registerValidation, validateRequest_1.default, auth_controller_1.default.register);
router.post("/login", auth_controller_1.default.login);
router.patch("/update-profile", authMiddleware_1.default, auth_validation_1.updateProfileValidation, validateRequest_1.default, auth_controller_1.default.updateProfile);
router.patch("/change-password", authMiddleware_1.default, auth_validation_1.changePasswordValidation, validateRequest_1.default, auth_controller_1.default.changePassword);
router.patch("/upload-profile-image", authMiddleware_1.default, upload_1.uploadProfileSingle, auth_controller_1.default.uploadProfileImage);
router.get("/google", passport_1.default.authenticate("google", {
    scope: ["profile", "email"],
}));
router.get("/google/callback", passport_1.default.authenticate("google", {
    failureRedirect: "/login",
    session: false,
}), auth_controller_1.default.googleCallback);
exports.default = router;
//# sourceMappingURL=auth.routes.js.map