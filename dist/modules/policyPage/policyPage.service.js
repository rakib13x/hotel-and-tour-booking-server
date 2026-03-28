"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PolicyPageService = void 0;
const ApiError_1 = __importDefault(require("../../utils/ApiError"));
const policyPage_model_1 = require("../../models/policyPage.model");
const http_status_codes_1 = require("http-status-codes");
const pagination_1 = __importDefault(require("../../utils/pagination"));
const checkValidID_1 = require("../../utils/checkValidID");
const mongoose_1 = __importDefault(require("mongoose"));
const createPolicyPageIntoDB = async (payload) => {
    const session = await mongoose_1.default.startSession();
    try {
        await session.startTransaction();
        // Check if a policy page with this slug already exists
        const existingPolicyPage = await policyPage_model_1.PolicyPage.findOne({ slug: payload.slug }).session(session);
        if (existingPolicyPage) {
            throw new ApiError_1.default(http_status_codes_1.StatusCodes.CONFLICT, `Policy page with slug '${payload.slug}' already exists`);
        }
        const result = await policyPage_model_1.PolicyPage.create([payload], { session });
        if (!result || result.length === 0) {
            throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Failed to create policy page");
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
const getAllPolicyPagesFromDB = async (query) => {
    const apiFeatures = new pagination_1.default(policyPage_model_1.PolicyPage.find(), query);
    // Search functionality
    apiFeatures.search(['slug', 'content']);
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
const getSinglePolicyPageFromDB = async (id) => {
    (0, checkValidID_1.checkValidID)(id);
    const result = await policyPage_model_1.PolicyPage.findById(id);
    if (!result) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "Policy page not found");
    }
    return result;
};
const getPolicyPageBySlugFromDB = async (slug) => {
    const result = await policyPage_model_1.PolicyPage.findOne({ slug });
    if (!result) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, `Policy page with slug '${slug}' not found`);
    }
    return result;
};
const updatePolicyPageIntoDB = async (id, payload) => {
    (0, checkValidID_1.checkValidID)(id);
    const session = await mongoose_1.default.startSession();
    try {
        await session.startTransaction();
        // If slug is being updated, check for conflicts
        if (payload.slug) {
            const existingPolicyPage = await policyPage_model_1.PolicyPage.findOne({
                slug: payload.slug,
                _id: { $ne: id }
            }).session(session);
            if (existingPolicyPage) {
                throw new ApiError_1.default(http_status_codes_1.StatusCodes.CONFLICT, `Policy page with slug '${payload.slug}' already exists`);
            }
        }
        const result = await policyPage_model_1.PolicyPage.findByIdAndUpdate(id, payload, { new: true, session });
        if (!result) {
            throw new ApiError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "Policy page not found");
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
const deletePolicyPageFromDB = async (id) => {
    (0, checkValidID_1.checkValidID)(id);
    const result = await policyPage_model_1.PolicyPage.findByIdAndDelete(id);
    if (!result) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "Policy page not found");
    }
    return result;
};
exports.PolicyPageService = {
    createPolicyPageIntoDB,
    getAllPolicyPagesFromDB,
    getSinglePolicyPageFromDB,
    getPolicyPageBySlugFromDB,
    updatePolicyPageIntoDB,
    deletePolicyPageFromDB,
};
//# sourceMappingURL=policyPage.service.js.map