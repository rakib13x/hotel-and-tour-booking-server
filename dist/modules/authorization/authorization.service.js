"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthorizationService = void 0;
const http_status_codes_1 = require("http-status-codes");
const mongoose_1 = __importDefault(require("mongoose"));
const ApiError_1 = __importDefault(require("../../utils/ApiError"));
const checkValidID_1 = require("../../utils/checkValidID");
const pagination_1 = __importDefault(require("../../utils/pagination"));
const authorization_model_1 = require("../../models/authorization.model");
const createAuthorizationIntoDB = async (payload) => {
    const session = await mongoose_1.default.startSession();
    try {
        await session.startTransaction();
        const result = await authorization_model_1.Authorization.create([payload], { session });
        if (!result || result.length === 0) {
            throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Failed to create authorization");
        }
        await session.commitTransaction();
        return result[0];
    }
    catch (error) {
        await session.abortTransaction();
        throw error;
    }
    finally {
        await session.endSession();
    }
};
const getAllAuthorizationsFromDB = async (query) => {
    const apiFeatures = new pagination_1.default(authorization_model_1.Authorization.find(), query);
    // Search functionality
    apiFeatures.search(["image"]);
    // Filter functionality
    apiFeatures.filter();
    // Get pagination info
    const paginationInfo = await apiFeatures.pagination();
    // Execute query
    const result = await apiFeatures.query;
    return {
        data: result,
        pagination: {
            page: paginationInfo.currentPage,
            limit: paginationInfo.limit,
            total: paginationInfo.total,
            pages: paginationInfo.totalPages,
        },
    };
};
const getSingleAuthorizationFromDB = async (id) => {
    (0, checkValidID_1.checkValidID)(id);
    const result = await authorization_model_1.Authorization.findById(id);
    if (!result) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "Authorization not found");
    }
    return result;
};
const updateAuthorizationIntoDB = async (id, payload) => {
    (0, checkValidID_1.checkValidID)(id);
    const session = await mongoose_1.default.startSession();
    try {
        await session.startTransaction();
        const result = await authorization_model_1.Authorization.findByIdAndUpdate(id, payload, {
            new: true,
            session,
        });
        if (!result) {
            throw new ApiError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "Authorization not found");
        }
        await session.commitTransaction();
        return result;
    }
    catch (error) {
        await session.abortTransaction();
        throw error;
    }
    finally {
        await session.endSession();
    }
};
const deleteAuthorizationFromDB = async (id) => {
    (0, checkValidID_1.checkValidID)(id);
    const result = await authorization_model_1.Authorization.findByIdAndDelete(id);
    if (!result) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "Authorization not found");
    }
    return result;
};
exports.AuthorizationService = {
    createAuthorizationIntoDB,
    getAllAuthorizationsFromDB,
    getSingleAuthorizationFromDB,
    updateAuthorizationIntoDB,
    deleteAuthorizationFromDB,
};
//# sourceMappingURL=authorization.service.js.map