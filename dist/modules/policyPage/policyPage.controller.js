"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PolicyPageController = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const http_status_codes_1 = require("http-status-codes");
const policyPage_service_1 = require("./policyPage.service");
const createPolicyPage = (0, catchAsync_1.default)(async (req, res) => {
    const result = await policyPage_service_1.PolicyPageService.createPolicyPageIntoDB(req.body);
    (0, sendResponse_1.default)(res, http_status_codes_1.StatusCodes.CREATED, {
        success: true,
        message: "Policy page created successfully",
        data: result,
    });
});
const getAllPolicyPages = (0, catchAsync_1.default)(async (req, res) => {
    const result = await policyPage_service_1.PolicyPageService.getAllPolicyPagesFromDB(req.query);
    (0, sendResponse_1.default)(res, http_status_codes_1.StatusCodes.OK, {
        success: true,
        message: "Policy pages retrieved successfully",
        data: result.data,
        pagination: result.pagination,
    });
});
const getSinglePolicyPage = (0, catchAsync_1.default)(async (req, res) => {
    const id = req.params.id;
    if (!id) {
        return (0, sendResponse_1.default)(res, http_status_codes_1.StatusCodes.BAD_REQUEST, {
            success: false,
            message: "Policy page ID is required",
        });
    }
    const result = await policyPage_service_1.PolicyPageService.getSinglePolicyPageFromDB(id);
    (0, sendResponse_1.default)(res, http_status_codes_1.StatusCodes.OK, {
        success: true,
        message: "Policy page retrieved successfully",
        data: result,
    });
});
const getPolicyPageBySlug = (0, catchAsync_1.default)(async (req, res) => {
    const slug = req.params.slug;
    if (!slug) {
        return (0, sendResponse_1.default)(res, http_status_codes_1.StatusCodes.BAD_REQUEST, {
            success: false,
            message: "Policy page slug is required",
        });
    }
    const result = await policyPage_service_1.PolicyPageService.getPolicyPageBySlugFromDB(slug);
    (0, sendResponse_1.default)(res, http_status_codes_1.StatusCodes.OK, {
        success: true,
        message: "Policy page retrieved successfully",
        data: result,
    });
});
const updatePolicyPage = (0, catchAsync_1.default)(async (req, res) => {
    const id = req.params.id;
    if (!id) {
        return (0, sendResponse_1.default)(res, http_status_codes_1.StatusCodes.BAD_REQUEST, {
            success: false,
            message: "Policy page ID is required",
        });
    }
    const result = await policyPage_service_1.PolicyPageService.updatePolicyPageIntoDB(id, req.body);
    (0, sendResponse_1.default)(res, http_status_codes_1.StatusCodes.OK, {
        success: true,
        message: "Policy page updated successfully",
        data: result,
    });
});
const deletePolicyPage = (0, catchAsync_1.default)(async (req, res) => {
    const id = req.params.id;
    if (!id) {
        return (0, sendResponse_1.default)(res, http_status_codes_1.StatusCodes.BAD_REQUEST, {
            success: false,
            message: "Policy page ID is required",
        });
    }
    const result = await policyPage_service_1.PolicyPageService.deletePolicyPageFromDB(id);
    (0, sendResponse_1.default)(res, http_status_codes_1.StatusCodes.OK, {
        success: true,
        message: "Policy page deleted successfully",
        data: result,
    });
});
exports.PolicyPageController = {
    createPolicyPage,
    getAllPolicyPages,
    getSinglePolicyPage,
    getPolicyPageBySlug,
    updatePolicyPage,
    deletePolicyPage,
};
//# sourceMappingURL=policyPage.controller.js.map