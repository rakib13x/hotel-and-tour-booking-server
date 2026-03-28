"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BannerService = void 0;
const http_status_codes_1 = require("http-status-codes");
const mongoose_1 = __importDefault(require("mongoose"));
const ApiError_1 = __importDefault(require("../../utils/ApiError"));
const banner_model_1 = require("../../models/banner.model");
const checkValidID_1 = require("../../utils/checkValidID");
const pagination_1 = __importDefault(require("../../utils/pagination"));
const createBannerIntoDB = async (payload) => {
    const session = await mongoose_1.default.startSession();
    try {
        await session.startTransaction();
        const result = await banner_model_1.Banner.create([payload], { session });
        if (!result || result.length === 0) {
            throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Failed to create banner");
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
const getAllBannersFromDB = async (query) => {
    const apiFeatures = new pagination_1.default(banner_model_1.Banner.find(), query);
    // Search functionality
    apiFeatures.search(["title", "description"]);
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
const getSingleBannerFromDB = async (id) => {
    (0, checkValidID_1.checkValidID)(id);
    const result = await banner_model_1.Banner.findById(id);
    if (!result) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "Banner not found");
    }
    return result;
};
const updateBannerIntoDB = async (id, payload) => {
    (0, checkValidID_1.checkValidID)(id);
    const session = await mongoose_1.default.startSession();
    try {
        await session.startTransaction();
        const result = await banner_model_1.Banner.findByIdAndUpdate(id, payload, {
            new: true,
            session,
        });
        if (!result) {
            throw new ApiError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "Banner not found");
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
const getActiveBannersFromDB = async () => {
    const result = await banner_model_1.Banner.find({ isActive: true }).sort({ createdAt: -1 });
    return result;
};
const deleteBannerFromDB = async (id) => {
    (0, checkValidID_1.checkValidID)(id);
    const result = await banner_model_1.Banner.findByIdAndDelete(id);
    if (!result) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "Banner not found");
    }
    return result;
};
const toggleBannerStatusInDB = async (id, isActive) => {
    const result = await banner_model_1.Banner.findByIdAndUpdate(id, { isActive }, { new: true });
    return result;
};
exports.BannerService = {
    createBannerIntoDB,
    getAllBannersFromDB,
    getSingleBannerFromDB,
    updateBannerIntoDB,
    getActiveBannersFromDB,
    deleteBannerFromDB,
    toggleBannerStatusInDB,
};
//# sourceMappingURL=banner.service.js.map