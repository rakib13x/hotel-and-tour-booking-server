"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FaqController = void 0;
const http_status_codes_1 = require("http-status-codes");
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const faq_service_1 = require("./faq.service");
const faq_validation_1 = require("./faq.validation");
const createFaq = (0, catchAsync_1.default)(async (req, res) => {
    const validatedData = faq_validation_1.FaqValidation.createFaqZodSchema.parse({
        body: req.body,
    });
    const result = await faq_service_1.FaqService.createFaqIntoDB(validatedData.body);
    (0, sendResponse_1.default)(res, http_status_codes_1.StatusCodes.CREATED, {
        success: true,
        message: "FAQ created successfully",
        data: result,
    });
});
const getAllFaqs = (0, catchAsync_1.default)(async (req, res) => {
    const result = await faq_service_1.FaqService.getAllFaqsFromDB(req.query);
    (0, sendResponse_1.default)(res, http_status_codes_1.StatusCodes.OK, {
        success: true,
        message: "FAQs retrieved successfully",
        data: result.data,
        pagination: result.pagination,
    });
});
const getSingleFaq = (0, catchAsync_1.default)(async (req, res) => {
    const id = req.params.id;
    if (!id) {
        return (0, sendResponse_1.default)(res, http_status_codes_1.StatusCodes.BAD_REQUEST, {
            success: false,
            message: "FAQ ID is required",
        });
    }
    const result = await faq_service_1.FaqService.getSingleFaqFromDB(id);
    (0, sendResponse_1.default)(res, http_status_codes_1.StatusCodes.OK, {
        success: true,
        message: "FAQ retrieved successfully",
        data: result,
    });
});
const updateFaq = (0, catchAsync_1.default)(async (req, res) => {
    const id = req.params.id;
    if (!id) {
        return (0, sendResponse_1.default)(res, http_status_codes_1.StatusCodes.BAD_REQUEST, {
            success: false,
            message: "FAQ ID is required",
        });
    }
    const validatedData = faq_validation_1.FaqValidation.updateFaqZodSchema.parse({
        body: req.body,
    });
    const result = await faq_service_1.FaqService.updateFaqIntoDB(id, validatedData.body);
    (0, sendResponse_1.default)(res, http_status_codes_1.StatusCodes.OK, {
        success: true,
        message: "FAQ updated successfully",
        data: result,
    });
});
const deleteFaq = (0, catchAsync_1.default)(async (req, res) => {
    const id = req.params.id;
    if (!id) {
        return (0, sendResponse_1.default)(res, http_status_codes_1.StatusCodes.BAD_REQUEST, {
            success: false,
            message: "FAQ ID is required",
        });
    }
    const result = await faq_service_1.FaqService.deleteFaqFromDB(id);
    (0, sendResponse_1.default)(res, http_status_codes_1.StatusCodes.OK, {
        success: true,
        message: "FAQ deleted successfully",
        data: result,
    });
});
const toggleFaqStatus = (0, catchAsync_1.default)(async (req, res) => {
    const id = req.params.id;
    if (!id) {
        return (0, sendResponse_1.default)(res, http_status_codes_1.StatusCodes.BAD_REQUEST, {
            success: false,
            message: "FAQ ID is required",
        });
    }
    const result = await faq_service_1.FaqService.toggleFaqStatusFromDB(id);
    (0, sendResponse_1.default)(res, http_status_codes_1.StatusCodes.OK, {
        success: true,
        message: `FAQ ${result?.isActive ? "activated" : "deactivated"} successfully`,
        data: result,
    });
});
const reorderFaqs = (0, catchAsync_1.default)(async (req, res) => {
    const validatedData = faq_validation_1.FaqValidation.reorderFaqsZodSchema.parse({
        body: req.body,
    });
    await faq_service_1.FaqService.reorderFaqsFromDB(validatedData.body);
    (0, sendResponse_1.default)(res, http_status_codes_1.StatusCodes.OK, {
        success: true,
        message: "FAQs reordered successfully",
    });
});
const getActiveFaqs = (0, catchAsync_1.default)(async (req, res) => {
    const result = await faq_service_1.FaqService.getActiveFaqsFromDB();
    (0, sendResponse_1.default)(res, http_status_codes_1.StatusCodes.OK, {
        success: true,
        message: "Active FAQs retrieved successfully",
        data: result,
    });
});
const getFaqStats = (0, catchAsync_1.default)(async (req, res) => {
    const result = await faq_service_1.FaqService.getFaqStatsFromDB();
    (0, sendResponse_1.default)(res, http_status_codes_1.StatusCodes.OK, {
        success: true,
        message: "FAQ statistics retrieved successfully",
        data: result,
    });
});
exports.FaqController = {
    createFaq,
    getAllFaqs,
    getSingleFaq,
    updateFaq,
    deleteFaq,
    toggleFaqStatus,
    reorderFaqs,
    getActiveFaqs,
    getFaqStats,
};
//# sourceMappingURL=faq.controller.js.map