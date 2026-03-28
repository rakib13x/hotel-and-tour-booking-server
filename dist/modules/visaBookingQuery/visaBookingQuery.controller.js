"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const visaBookingQuery_service_1 = __importDefault(require("./visaBookingQuery.service"));
const ApiError_1 = __importDefault(require("../../utils/ApiError"));
class VisaBookingQueryController {
    constructor() {
        // Create visa booking query (Public)
        this.createVisaBookingQuery = (0, catchAsync_1.default)(async (req, res) => {
            console.log("=== CREATE VISA BOOKING QUERY ===");
            console.log("Request body:", req.body);
            const query = await visaBookingQuery_service_1.default.createVisaBookingQuery(req.body);
            (0, sendResponse_1.default)(res, 201, {
                success: true,
                message: "Your visa application has been submitted successfully! We will contact you soon.",
                data: query,
            });
        });
        // Get all visa booking queries (Admin only)
        this.getVisaBookingQueries = (0, catchAsync_1.default)(async (req, res) => {
            const result = await visaBookingQuery_service_1.default.getVisaBookingQueries(req.query);
            (0, sendResponse_1.default)(res, 200, {
                success: true,
                message: "Visa booking queries retrieved successfully",
                data: result.data,
                pagination: result.pagination,
            });
        });
        // Get visa booking query by ID (Admin only)
        this.getVisaBookingQueryById = (0, catchAsync_1.default)(async (req, res) => {
            const query = await visaBookingQuery_service_1.default.getVisaBookingQueryById(req.params.id);
            (0, sendResponse_1.default)(res, 200, {
                success: true,
                message: "Visa booking query retrieved successfully",
                data: query,
            });
        });
        // Update visa booking query status (Admin only)
        this.updateVisaBookingQueryStatus = (0, catchAsync_1.default)(async (req, res) => {
            const query = await visaBookingQuery_service_1.default.updateVisaBookingQueryStatus(req.params.id, req.body);
            (0, sendResponse_1.default)(res, 200, {
                success: true,
                message: "Visa booking query status updated successfully",
                data: query,
            });
        });
        // Delete visa booking query (Admin only)
        this.deleteVisaBookingQuery = (0, catchAsync_1.default)(async (req, res) => {
            console.log("=== DELETE VISA BOOKING QUERY ===");
            console.log("Query ID:", req.params.id);
            console.log("User:", req.user);
            await visaBookingQuery_service_1.default.deleteVisaBookingQuery(req.params.id);
            console.log("Query deleted successfully");
            (0, sendResponse_1.default)(res, 200, {
                success: true,
                message: "Visa booking query deleted successfully",
            });
        });
        // Get statistics (Admin only)
        this.getVisaBookingQueryStats = (0, catchAsync_1.default)(async (req, res) => {
            const stats = await visaBookingQuery_service_1.default.getVisaBookingQueryStats();
            (0, sendResponse_1.default)(res, 200, {
                success: true,
                message: "Statistics retrieved successfully",
                data: stats,
            });
        });
        // Get user's own visa booking queries (User only)
        this.getMyVisaBookingQueries = (0, catchAsync_1.default)(async (req, res) => {
            const userId = req.user?.id;
            if (!userId) {
                throw new ApiError_1.default(401, "User not authenticated");
            }
            const queries = await visaBookingQuery_service_1.default.getMyVisaBookingQueries(userId);
            (0, sendResponse_1.default)(res, 200, {
                success: true,
                message: "User visa booking queries retrieved successfully",
                data: queries,
            });
        });
    }
}
exports.default = new VisaBookingQueryController();
//# sourceMappingURL=visaBookingQuery.controller.js.map