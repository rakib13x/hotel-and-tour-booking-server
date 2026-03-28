"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FaqService = void 0;
const http_status_codes_1 = require("http-status-codes");
const ApiError_1 = __importDefault(require("../../utils/ApiError"));
const checkValidID_1 = require("../../utils/checkValidID");
const pagination_1 = __importDefault(require("../../utils/pagination"));
const faq_model_1 = require("../../models/faq.model");
const createFaqIntoDB = async (payload) => {
    // If orderIndex is not provided, set it to the highest + 1
    if (!payload.orderIndex) {
        const lastFaq = await faq_model_1.Faq.findOne().sort({ orderIndex: -1 });
        payload.orderIndex = lastFaq ? lastFaq.orderIndex + 1 : 1;
    }
    const result = await faq_model_1.Faq.create(payload);
    if (!result) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Failed to create FAQ");
    }
    return result;
};
const getAllFaqsFromDB = async (query = {}) => {
    // Transform sortBy and sortOrder to sort parameter for APIFeatures
    const queryParams = { ...query };
    if (query.sortBy && query.sortOrder) {
        queryParams.sort = `${query.sortOrder === "desc" ? "-" : ""}${query.sortBy}`;
        delete queryParams.sortBy;
        delete queryParams.sortOrder;
    }
    const apiFeatures = new pagination_1.default(faq_model_1.Faq.find(), queryParams);
    // Search functionality
    apiFeatures.search(["question", "answer"]);
    // Filter functionality
    apiFeatures.filter();
    // Sort functionality
    apiFeatures.sort();
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
const getSingleFaqFromDB = async (id) => {
    (0, checkValidID_1.checkValidID)(id);
    const result = await faq_model_1.Faq.findById(id);
    if (!result) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "FAQ not found");
    }
    return result;
};
const updateFaqIntoDB = async (id, payload) => {
    (0, checkValidID_1.checkValidID)(id);
    const result = await faq_model_1.Faq.findByIdAndUpdate(id, { ...payload, updatedAt: new Date() }, { new: true, runValidators: true });
    if (!result) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "FAQ not found");
    }
    return result;
};
const deleteFaqFromDB = async (id) => {
    (0, checkValidID_1.checkValidID)(id);
    const result = await faq_model_1.Faq.findByIdAndDelete(id);
    if (!result) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "FAQ not found");
    }
    return result;
};
const toggleFaqStatusFromDB = async (id) => {
    (0, checkValidID_1.checkValidID)(id);
    const faq = await faq_model_1.Faq.findById(id);
    if (!faq) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "FAQ not found");
    }
    faq.isActive = !faq.isActive;
    await faq.save();
    return faq;
};
const reorderFaqsFromDB = async (data) => {
    const { faqs } = data;
    // Validate all FAQ IDs exist
    const faqIds = faqs.map((f) => f.id);
    const existingFaqs = await faq_model_1.Faq.find({ _id: { $in: faqIds } });
    if (existingFaqs.length !== faqIds.length) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "One or more FAQ IDs are invalid");
    }
    // Update order indices
    const updatePromises = faqs.map(({ id, orderIndex }) => faq_model_1.Faq.findByIdAndUpdate(id, { orderIndex }));
    await Promise.all(updatePromises);
};
const getActiveFaqsFromDB = async () => {
    const result = (await faq_model_1.Faq.find({ isActive: true })
        .sort({ orderIndex: 1 })
        .lean());
    return result;
};
const getFaqStatsFromDB = async () => {
    const [total, active, inactive] = await Promise.all([
        faq_model_1.Faq.countDocuments(),
        faq_model_1.Faq.countDocuments({ isActive: true }),
        faq_model_1.Faq.countDocuments({ isActive: false }),
    ]);
    return { total, active, inactive };
};
exports.FaqService = {
    createFaqIntoDB,
    getAllFaqsFromDB,
    getSingleFaqFromDB,
    updateFaqIntoDB,
    deleteFaqFromDB,
    toggleFaqStatusFromDB,
    reorderFaqsFromDB,
    getActiveFaqsFromDB,
    getFaqStatsFromDB,
};
//# sourceMappingURL=faq.service.js.map