"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueryController = void 0;
const http_status_codes_1 = require("http-status-codes");
const logger_1 = __importDefault(require("../../config/logger"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const query_service_1 = require("./query.service");
const ApiError_1 = __importDefault(require("../../utils/ApiError"));
// Create new query
const createQuery = (0, catchAsync_1.default)(async (req, res) => {
    const queryData = req.body;
    logger_1.default.info("Query form submission received", {
        email: queryData.email,
        name: queryData.name,
        formType: queryData.formType,
    });
    const result = await query_service_1.QueryService.createQuery(queryData);
    (0, sendResponse_1.default)(res, http_status_codes_1.StatusCodes.CREATED, {
        success: true,
        message: "Query submitted successfully! We'll get back to you soon.",
        data: {
            id: result._id,
            name: result.name,
            email: result.email,
            formType: result.formType,
            status: result.status,
            submittedAt: result.createdAt,
        },
    });
});
// Get all queries with pagination, search, and filtering
const getAllQueries = (0, catchAsync_1.default)(async (req, res) => {
    const { page = "1", limit = "10", sortBy = "createdAt", sortOrder = "desc", search, formType, status, } = req.query;
    // Convert string parameters to appropriate types
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);
    const sortOrderValue = sortOrder.toLowerCase() === "asc" ? "asc" : "desc";
    logger_1.default.info("Fetching queries with filters", {
        page: pageNumber,
        limit: limitNumber,
        sortBy,
        sortOrder: sortOrderValue,
        search: search || "none",
        formType: formType || "none",
        status: status || "none",
    });
    const result = await query_service_1.QueryService.getAllQueries(pageNumber, limitNumber, sortBy, sortOrderValue, search, formType, status);
    (0, sendResponse_1.default)(res, http_status_codes_1.StatusCodes.OK, {
        success: true,
        message: "Queries retrieved successfully",
        data: result.queries,
        pagination: {
            page: result.currentPage,
            limit: limitNumber,
            total: result.totalQueries,
            pages: result.totalPages,
        },
    });
});
// Get query by ID
const getQueryById = (0, catchAsync_1.default)(async (req, res) => {
    const { id } = req.params;
    logger_1.default.info("Fetching query by ID", { queryId: id });
    const result = await query_service_1.QueryService.getQueryById(id);
    (0, sendResponse_1.default)(res, http_status_codes_1.StatusCodes.OK, {
        success: true,
        message: "Query retrieved successfully",
        data: result,
    });
});
// Update query by ID
const updateQueryById = (0, catchAsync_1.default)(async (req, res) => {
    const { id } = req.params;
    const updateData = req.body;
    logger_1.default.info("Updating query by ID", { queryId: id, updateData });
    const result = await query_service_1.QueryService.updateQueryById(id, updateData);
    (0, sendResponse_1.default)(res, http_status_codes_1.StatusCodes.OK, {
        success: true,
        message: "Query updated successfully",
        data: result,
    });
});
// Delete query by ID
const deleteQueryById = (0, catchAsync_1.default)(async (req, res) => {
    const { id } = req.params;
    logger_1.default.info("Deleting query by ID", { queryId: id });
    await query_service_1.QueryService.deleteQueryById(id);
    (0, sendResponse_1.default)(res, http_status_codes_1.StatusCodes.OK, {
        success: true,
        message: "Query deleted successfully",
        data: null,
    });
});
// Get query statistics
const getQueryStats = (0, catchAsync_1.default)(async (req, res) => {
    logger_1.default.info("Fetching query statistics");
    const result = await query_service_1.QueryService.getQueryStats();
    (0, sendResponse_1.default)(res, http_status_codes_1.StatusCodes.OK, {
        success: true,
        message: "Query statistics retrieved successfully",
        data: result,
    });
});
// Get queries by form type
const getQueriesByFormType = (0, catchAsync_1.default)(async (req, res) => {
    const formType = req.params.formType;
    const { page = "1", limit = "10" } = req.query;
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);
    logger_1.default.info("Fetching queries by form type", {
        formType,
        page: pageNumber,
        limit: limitNumber,
    });
    const result = await query_service_1.QueryService.getQueriesByFormType(formType, pageNumber, limitNumber);
    (0, sendResponse_1.default)(res, http_status_codes_1.StatusCodes.OK, {
        success: true,
        message: `Queries for ${formType} retrieved successfully`,
        data: result.queries,
        pagination: {
            page: result.currentPage,
            limit: limitNumber,
            total: result.totalQueries,
            pages: result.totalPages,
        },
    });
});
// Get user's own queries
const getMyQueries = (0, catchAsync_1.default)(async (req, res) => {
    const userId = req.user?.id;
    logger_1.default.info("Fetching user's own queries", { userId });
    if (!userId) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.UNAUTHORIZED, "User not authenticated");
    }
    const queries = await query_service_1.QueryService.getMyQueries(userId);
    (0, sendResponse_1.default)(res, http_status_codes_1.StatusCodes.OK, {
        success: true,
        message: "User queries retrieved successfully",
        data: queries,
    });
});
exports.QueryController = {
    createQuery,
    getAllQueries,
    getQueryById,
    updateQueryById,
    deleteQueryById,
    getQueryStats,
    getQueriesByFormType,
    getMyQueries,
};
//# sourceMappingURL=query.controller.js.map