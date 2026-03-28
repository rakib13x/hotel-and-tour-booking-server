"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const adminMiddleware_1 = __importDefault(require("../../middlewares/adminMiddleware"));
const authMiddleware_1 = __importDefault(require("../../middlewares/authMiddleware"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const user_1 = require("../../enums/user");
const zodValidation_1 = __importDefault(require("../../middlewares/zodValidation"));
const visaBookingQuery_controller_1 = __importDefault(require("./visaBookingQuery.controller"));
const visaBookingQuery_validation_1 = require("./visaBookingQuery.validation");
const router = express_1.default.Router();
// Public routes
router.post("/", (0, zodValidation_1.default)(visaBookingQuery_validation_1.zCreateVisaBookingQuery), visaBookingQuery_controller_1.default.createVisaBookingQuery);
// User only routes
router.get("/my-queries", (0, auth_1.default)(user_1.USER_ROLES.USER, user_1.USER_ROLES.ADMIN, user_1.USER_ROLES.SUPER_ADMIN), visaBookingQuery_controller_1.default.getMyVisaBookingQueries);
// Protected routes (Admin only)
// Note: We apply admin check only to the routes below
router.get("/", authMiddleware_1.default, adminMiddleware_1.default, visaBookingQuery_controller_1.default.getVisaBookingQueries);
router.get("/stats", authMiddleware_1.default, adminMiddleware_1.default, visaBookingQuery_controller_1.default.getVisaBookingQueryStats);
router.get("/:id", authMiddleware_1.default, adminMiddleware_1.default, visaBookingQuery_controller_1.default.getVisaBookingQueryById);
router.patch("/:id", authMiddleware_1.default, adminMiddleware_1.default, (0, zodValidation_1.default)(visaBookingQuery_validation_1.zUpdateVisaBookingQuery), visaBookingQuery_controller_1.default.updateVisaBookingQueryStatus);
router.delete("/:id", authMiddleware_1.default, adminMiddleware_1.default, visaBookingQuery_controller_1.default.deleteVisaBookingQuery);
exports.default = router;
//# sourceMappingURL=visaBookingQuery.routes.js.map