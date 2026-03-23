import { Router } from "express";
import { USER_ROLES } from "../../enums/user";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/zodValidation";
import { QueryController } from "./query.controller";
import { QueryValidation } from "./query.validation";

const router = Router();

/**
 * @route POST /api/queries/create
 * @desc Create new query (public access for form submissions)
 * @access Public
 */
router.post(
  "/create",
  validateRequest(QueryValidation.createQueryValidation),
  QueryController.createQuery
);

/**
 * @route GET /api/queries/my-queries
 * @desc Get user's own queries
 * @access Private (Authenticated User)
 */
router.get(
  "/my-queries",
  auth(USER_ROLES.USER, USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
  QueryController.getMyQueries
);

/**
 * @route GET /api/queries/all
 * @desc Get all queries with pagination, search, and filtering
 * @access Private (Admin only)
 * @query page, limit, sortBy, sortOrder, search, formType, status
 */
router.get(
  "/all",
  auth([USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN]),
  validateRequest(QueryValidation.getAllQueriesValidation),
  QueryController.getAllQueries
);

/**
 * @route GET /api/queries/stats
 * @desc Get query statistics for admin dashboard
 * @access Private (Admin only)
 */
router.get(
  "/stats",
  auth([USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN]),
  QueryController.getQueryStats
);

/**
 * @route GET /api/queries/form-type/:formType
 * @desc Get queries by form type with pagination
 * @access Private (Admin only)
 * @param formType - hajj_umrah, package_tour, or group_ticket
 * @query page, limit
 */
router.get(
  "/form-type/:formType",
  auth([USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN]),
  QueryController.getQueriesByFormType
);

/**
 * @route GET /api/queries/:id
 * @desc Get query by ID
 * @access Private (Admin only)
 */
router.get(
  "/:id",
  auth([USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN]),
  validateRequest(QueryValidation.getQueryWithParamsValidation),
  QueryController.getQueryById
);

/**
 * @route PUT /api/queries/:id
 * @desc Update query by ID (mainly for status updates)
 * @access Private (Admin only)
 */
router.put(
  "/:id",
  auth([USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN]),
  validateRequest(QueryValidation.updateQueryWithParamsValidation),
  QueryController.updateQueryById
);

/**
 * @route DELETE /api/queries/:id
 * @desc Delete query by ID
 * @access Private (Admin only)
 */
router.delete(
  "/:id",
  auth([USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN]),
  validateRequest(QueryValidation.deleteQueryWithParamsValidation),
  QueryController.deleteQueryById
);

export const QueryRoutes = router;
