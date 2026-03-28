"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const adminMiddleware_1 = __importDefault(require("../../middlewares/adminMiddleware"));
const authMiddleware_1 = __importDefault(require("../../middlewares/authMiddleware"));
const zodValidation_1 = __importDefault(require("../../middlewares/zodValidation"));
const customTourQuery_controller_1 = __importDefault(require("./customTourQuery.controller"));
const customTourQuery_validation_1 = require("./customTourQuery.validation");
const router = express_1.default.Router();
// Public routes
router.post("/", (0, zodValidation_1.default)(customTourQuery_validation_1.zCreateCustomTourQuery), customTourQuery_controller_1.default.createCustomTourQuery);
// Protected routes (Admin only)
router.use(authMiddleware_1.default);
router.use(adminMiddleware_1.default);
router.get("/", customTourQuery_controller_1.default.getCustomTourQueries);
router.get("/stats", customTourQuery_controller_1.default.getCustomTourQueryStats);
router.get("/:id", customTourQuery_controller_1.default.getCustomTourQueryById);
router.put("/:id", (0, zodValidation_1.default)(customTourQuery_validation_1.zUpdateCustomTourQuery), customTourQuery_controller_1.default.updateCustomTourQuery);
router.delete("/:id", customTourQuery_controller_1.default.deleteCustomTourQuery);
exports.default = router;
//# sourceMappingURL=customTourQuery.routes.js.map