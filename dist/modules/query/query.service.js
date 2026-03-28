"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueryService = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const logger_1 = __importDefault(require("../../config/logger"));
const query_model_1 = require("../../models/query.model");
const auth_model_1 = __importDefault(require("../auth/auth.model"));
const ApiError_1 = __importDefault(require("../../utils/ApiError"));
// Create new query
const createQuery = async (queryData) => {
    try {
        const newQuery = await query_model_1.Query.create(queryData);
        logger_1.default.info("Query created successfully", { queryId: newQuery._id });
        return newQuery;
    }
    catch (error) {
        logger_1.default.error("Error in createQuery:", error);
        if (error.name === "ValidationError") {
            throw new ApiError_1.default(http_status_codes_1.default.BAD_REQUEST, "Validation failed: " + error.message);
        }
        if (error.code === 11000) {
            throw new ApiError_1.default(http_status_codes_1.default.CONFLICT, "Duplicate entry detected");
        }
        throw new ApiError_1.default(http_status_codes_1.default.INTERNAL_SERVER_ERROR, "Failed to create query");
    }
};
// Get all queries with pagination, sorting, and filtering
const getAllQueries = async (page = 1, limit = 10, sortBy = "createdAt", sortOrder = "desc", search, formType, status) => {
    try {
        // Validate pagination parameters
        const pageNumber = Math.max(1, page);
        const limitNumber = Math.max(1, Math.min(100, limit)); // Max 100 items per page
        const skip = (pageNumber - 1) * limitNumber;
        // Build search query
        let searchQuery = {};
        if (search && search.trim()) {
            const searchRegex = new RegExp(search.trim(), "i");
            searchQuery.$or = [
                { name: { $regex: searchRegex } },
                { email: { $regex: searchRegex } },
                { contactNumber: { $regex: searchRegex } },
                { specialRequirements: { $regex: searchRegex } },
                { visitingCountry: { $regex: searchRegex } },
                { visitingCities: { $regex: searchRegex } },
            ];
        }
        // Add form type filter
        if (formType &&
            ["hajj_umrah", "package_tour", "group_ticket"].includes(formType)) {
            searchQuery.formType = formType;
        }
        // Add status filter
        if (status &&
            ["pending", "reviewed", "contacted", "closed"].includes(status)) {
            searchQuery.status = status;
        }
        // Build sort object
        const sortObject = {};
        sortObject[sortBy] = sortOrder === "asc" ? 1 : -1;
        // Execute queries in parallel
        const [queries, totalQueries] = await Promise.all([
            query_model_1.Query.find(searchQuery)
                .sort(sortObject)
                .skip(skip)
                .limit(limitNumber)
                .lean(),
            query_model_1.Query.countDocuments(searchQuery),
        ]);
        // Calculate pagination info
        const totalPages = Math.ceil(totalQueries / limitNumber);
        const hasNextPage = pageNumber < totalPages;
        const hasPrevPage = pageNumber > 1;
        logger_1.default.info("Queries retrieved successfully", {
            count: queries.length,
            totalQueries,
            page: pageNumber,
        });
        return {
            queries,
            totalQueries,
            totalPages,
            currentPage: pageNumber,
            hasNextPage,
            hasPrevPage,
        };
    }
    catch (error) {
        logger_1.default.error("Error in getAllQueries:", error);
        throw new ApiError_1.default(http_status_codes_1.default.INTERNAL_SERVER_ERROR, "Failed to retrieve queries");
    }
};
// Get query by ID
const getQueryById = async (queryId) => {
    try {
        const query = await query_model_1.Query.findById(queryId).lean();
        if (!query) {
            throw new ApiError_1.default(http_status_codes_1.default.NOT_FOUND, "Query not found");
        }
        logger_1.default.info("Query retrieved successfully", { queryId });
        return query;
    }
    catch (error) {
        logger_1.default.error("Error in getQueryById:", error);
        if (error.name === "CastError") {
            throw new ApiError_1.default(http_status_codes_1.default.BAD_REQUEST, "Invalid query ID format");
        }
        if (error instanceof ApiError_1.default) {
            throw error;
        }
        throw new ApiError_1.default(http_status_codes_1.default.INTERNAL_SERVER_ERROR, "Failed to retrieve query");
    }
};
// Update query by ID
const updateQueryById = async (queryId, updateData) => {
    try {
        const updatedQuery = await query_model_1.Query.findByIdAndUpdate(queryId, updateData, {
            new: true,
            runValidators: true,
        }).lean();
        if (!updatedQuery) {
            throw new ApiError_1.default(http_status_codes_1.default.NOT_FOUND, "Query not found");
        }
        logger_1.default.info("Query updated successfully", { queryId });
        return updatedQuery;
    }
    catch (error) {
        logger_1.default.error("Error in updateQueryById:", error);
        if (error.name === "CastError") {
            throw new ApiError_1.default(http_status_codes_1.default.BAD_REQUEST, "Invalid query ID format");
        }
        if (error.name === "ValidationError") {
            throw new ApiError_1.default(http_status_codes_1.default.BAD_REQUEST, "Validation failed: " + error.message);
        }
        if (error instanceof ApiError_1.default) {
            throw error;
        }
        throw new ApiError_1.default(http_status_codes_1.default.INTERNAL_SERVER_ERROR, "Failed to update query");
    }
};
// Delete query by ID
const deleteQueryById = async (queryId) => {
    try {
        const deletedQuery = await query_model_1.Query.findByIdAndDelete(queryId);
        if (!deletedQuery) {
            throw new ApiError_1.default(http_status_codes_1.default.NOT_FOUND, "Query not found");
        }
        logger_1.default.info("Query deleted successfully", { queryId });
    }
    catch (error) {
        logger_1.default.error("Error in deleteQueryById:", error);
        if (error.name === "CastError") {
            throw new ApiError_1.default(http_status_codes_1.default.BAD_REQUEST, "Invalid query ID format");
        }
        if (error instanceof ApiError_1.default) {
            throw error;
        }
        throw new ApiError_1.default(http_status_codes_1.default.INTERNAL_SERVER_ERROR, "Failed to delete query");
    }
};
// Get query statistics
const getQueryStats = async () => {
    try {
        const now = new Date();
        const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const startOfWeek = new Date(startOfDay);
        startOfWeek.setDate(startOfDay.getDate() - startOfDay.getDay());
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const [totalQueries, todayQueries, weekQueries, monthQueries, pendingQueries, reviewedQueries, contactedQueries, closedQueries, hajjUmrahQueries, packageTourQueries, groupTicketQueries,] = await Promise.all([
            query_model_1.Query.countDocuments(),
            query_model_1.Query.countDocuments({ createdAt: { $gte: startOfDay } }),
            query_model_1.Query.countDocuments({ createdAt: { $gte: startOfWeek } }),
            query_model_1.Query.countDocuments({ createdAt: { $gte: startOfMonth } }),
            query_model_1.Query.countDocuments({ status: "pending" }),
            query_model_1.Query.countDocuments({ status: "reviewed" }),
            query_model_1.Query.countDocuments({ status: "contacted" }),
            query_model_1.Query.countDocuments({ status: "closed" }),
            query_model_1.Query.countDocuments({ formType: "hajj_umrah" }),
            query_model_1.Query.countDocuments({ formType: "package_tour" }),
            query_model_1.Query.countDocuments({ formType: "group_ticket" }),
        ]);
        return {
            totalQueries,
            todayQueries,
            weekQueries,
            monthQueries,
            pendingQueries,
            reviewedQueries,
            contactedQueries,
            closedQueries,
            hajjUmrahQueries,
            packageTourQueries,
            groupTicketQueries,
        };
    }
    catch (error) {
        logger_1.default.error("Error in getQueryStats:", error);
        throw new ApiError_1.default(http_status_codes_1.default.INTERNAL_SERVER_ERROR, "Failed to retrieve query statistics");
    }
};
// Get queries by form type
const getQueriesByFormType = async (formType, page = 1, limit = 10) => {
    try {
        const pageNumber = Math.max(1, page);
        const limitNumber = Math.max(1, Math.min(100, limit));
        const skip = (pageNumber - 1) * limitNumber;
        const [queries, totalQueries] = await Promise.all([
            query_model_1.Query.find({ formType })
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limitNumber)
                .lean(),
            query_model_1.Query.countDocuments({ formType }),
        ]);
        const totalPages = Math.ceil(totalQueries / limitNumber);
        logger_1.default.info("Queries retrieved by form type successfully", {
            formType,
            count: queries.length,
            totalQueries,
            page: pageNumber,
        });
        return {
            queries,
            totalQueries,
            totalPages,
            currentPage: pageNumber,
        };
    }
    catch (error) {
        logger_1.default.error("Error in getQueriesByFormType:", error);
        throw new ApiError_1.default(http_status_codes_1.default.INTERNAL_SERVER_ERROR, "Failed to retrieve queries by form type");
    }
};
// Get user's own queries
const getMyQueries = async (userId) => {
    try {
        // Find user to get their email
        const user = await auth_model_1.default.findById(userId);
        if (!user) {
            throw new ApiError_1.default(http_status_codes_1.default.NOT_FOUND, "User not found");
        }
        const userEmail = user.email.trim().toLowerCase();
        // Find queries by email (case-insensitive)
        const queries = await query_model_1.Query.find({
            email: {
                $regex: `^${userEmail.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`,
                $options: "i",
            },
        })
            .sort({ createdAt: -1 })
            .lean();
        logger_1.default.info("User queries retrieved successfully", {
            userId,
            email: userEmail,
            count: queries.length,
        });
        return queries;
    }
    catch (error) {
        logger_1.default.error("Error in getMyQueries:", error);
        if (error instanceof ApiError_1.default) {
            throw error;
        }
        throw new ApiError_1.default(http_status_codes_1.default.INTERNAL_SERVER_ERROR, "Failed to retrieve user queries");
    }
};
exports.QueryService = {
    createQuery,
    getAllQueries,
    getQueryById,
    updateQueryById,
    deleteQueryById,
    getQueryStats,
    getQueriesByFormType,
    getMyQueries,
};
//# sourceMappingURL=query.service.js.map