"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const customTourQuery_service_1 = __importDefault(require("./customTourQuery.service"));
class CustomTourQueryController {
    constructor() {
        // Create custom tour query (Public)
        this.createCustomTourQuery = (0, catchAsync_1.default)(async (req, res) => {
            console.log("=== CREATE CUSTOM TOUR QUERY ===");
            console.log("Request body:", req.body);
            const query = await customTourQuery_service_1.default.createCustomTourQuery(req.body);
            (0, sendResponse_1.default)(res, 201, {
                success: true,
                message: "Your query has been submitted successfully! We will contact you soon.",
                data: query,
            });
        });
        // Get all custom tour queries (Admin only)
        this.getCustomTourQueries = (0, catchAsync_1.default)(async (req, res) => {
            const result = await customTourQuery_service_1.default.getCustomTourQueries(req.query);
            (0, sendResponse_1.default)(res, 200, {
                success: true,
                message: "Custom tour queries retrieved successfully",
                data: result.data,
                pagination: result.pagination,
            });
        });
        // Get custom tour query by ID (Admin only)
        this.getCustomTourQueryById = (0, catchAsync_1.default)(async (req, res) => {
            const query = await customTourQuery_service_1.default.getCustomTourQueryById(req.params.id);
            (0, sendResponse_1.default)(res, 200, {
                success: true,
                message: "Custom tour query retrieved successfully",
                data: query,
            });
        });
        // Update custom tour query (Admin only)
        this.updateCustomTourQuery = (0, catchAsync_1.default)(async (req, res) => {
            const query = await customTourQuery_service_1.default.updateCustomTourQuery(req.params.id, req.body);
            (0, sendResponse_1.default)(res, 200, {
                success: true,
                message: "Custom tour query updated successfully",
                data: query,
            });
        });
        // Delete custom tour query (Admin only)
        this.deleteCustomTourQuery = (0, catchAsync_1.default)(async (req, res) => {
            await customTourQuery_service_1.default.deleteCustomTourQuery(req.params.id);
            (0, sendResponse_1.default)(res, 200, {
                success: true,
                message: "Custom tour query deleted successfully",
            });
        });
        // Get statistics (Admin only)
        this.getCustomTourQueryStats = (0, catchAsync_1.default)(async (req, res) => {
            const stats = await customTourQuery_service_1.default.getCustomTourQueryStats();
            (0, sendResponse_1.default)(res, 200, {
                success: true,
                message: "Statistics retrieved successfully",
                data: stats,
            });
        });
    }
}
exports.default = new CustomTourQueryController();
//# sourceMappingURL=customTourQuery.controller.js.map