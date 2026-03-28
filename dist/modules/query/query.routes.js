"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueryRoutes = void 0;
const express_1 = require("express");
const user_1 = require("../../enums/user");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const zodValidation_1 = __importDefault(require("../../middlewares/zodValidation"));
const query_controller_1 = require("./query.controller");
const query_validation_1 = require("./query.validation");
const router = (0, express_1.Router)();
/**
 * @route POST /api/queries/create
 * @desc Create new query (public access for form submissions)
 * @access Public
 */
router.post("/create", (0, zodValidation_1.default)(query_validation_1.QueryValidation.createQueryValidation), query_controller_1.QueryController.createQuery);
/**
 * @route GET /api/queries/my-queries
 * @desc Get user's own queries
 * @access Private (Authenticated User)
 */
router.get("/my-queries", (0, auth_1.default)(user_1.USER_ROLES.USER, user_1.USER_ROLES.ADMIN, user_1.USER_ROLES.SUPER_ADMIN), query_controller_1.QueryController.getMyQueries);
/**
 * @route GET /api/queries/all
 * @desc Get all queries with pagination, search, and filtering
 * @access Private (Admin only)
 * @query page, limit, sortBy, sortOrder, search, formType, status
 */
router.get("/all", (0, auth_1.default)([user_1.USER_ROLES.ADMIN, user_1.USER_ROLES.SUPER_ADMIN]), (0, zodValidation_1.default)(query_validation_1.QueryValidation.getAllQueriesValidation), query_controller_1.QueryController.getAllQueries);
/**
 * @route GET /api/queries/stats
 * @desc Get query statistics for admin dashboard
 * @access Private (Admin only)
 */
router.get("/stats", (0, auth_1.default)([user_1.USER_ROLES.ADMIN, user_1.USER_ROLES.SUPER_ADMIN]), query_controller_1.QueryController.getQueryStats);
/**
 * @route GET /api/queries/form-type/:formType
 * @desc Get queries by form type with pagination
 * @access Private (Admin only)
 * @param formType - hajj_umrah, package_tour, or group_ticket
 * @query page, limit
 */
router.get("/form-type/:formType", (0, auth_1.default)([user_1.USER_ROLES.ADMIN, user_1.USER_ROLES.SUPER_ADMIN]), query_controller_1.QueryController.getQueriesByFormType);
/**
 * @route GET /api/queries/:id
 * @desc Get query by ID
 * @access Private (Admin only)
 */
router.get("/:id", (0, auth_1.default)([user_1.USER_ROLES.ADMIN, user_1.USER_ROLES.SUPER_ADMIN]), (0, zodValidation_1.default)(query_validation_1.QueryValidation.getQueryWithParamsValidation), query_controller_1.QueryController.getQueryById);
/**
 * @route PUT /api/queries/:id
 * @desc Update query by ID (mainly for status updates)
 * @access Private (Admin only)
 */
router.put("/:id", (0, auth_1.default)([user_1.USER_ROLES.ADMIN, user_1.USER_ROLES.SUPER_ADMIN]), (0, zodValidation_1.default)(query_validation_1.QueryValidation.updateQueryWithParamsValidation), query_controller_1.QueryController.updateQueryById);
/**
 * @route DELETE /api/queries/:id
 * @desc Delete query by ID
 * @access Private (Admin only)
 */
router.delete("/:id", (0, auth_1.default)([user_1.USER_ROLES.ADMIN, user_1.USER_ROLES.SUPER_ADMIN]), (0, zodValidation_1.default)(query_validation_1.QueryValidation.deleteQueryWithParamsValidation), query_controller_1.QueryController.deleteQueryById);
exports.QueryRoutes = router;
//# sourceMappingURL=query.routes.js.map