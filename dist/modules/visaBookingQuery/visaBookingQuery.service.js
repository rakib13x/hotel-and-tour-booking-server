"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const visaBookingQuery_model_1 = require("../../models/visaBookingQuery.model");
const auth_model_1 = __importDefault(require("../auth/auth.model"));
const ApiError_1 = __importDefault(require("../../utils/ApiError"));
const pagination_1 = __importDefault(require("../../utils/pagination"));
class VisaBookingQueryService {
    // Create visa booking query
    async createVisaBookingQuery(input) {
        const query = new visaBookingQuery_model_1.VisaBookingQuery(input);
        await query.save();
        return query;
    }
    // Get all visa booking queries with pagination
    async getVisaBookingQueries(options) {
        const { page = 1, limit = 10, search, status, type, country, sortBy = "createdAt", sortOrder = "desc", } = options;
        const filter = {};
        // Status filter
        if (status) {
            filter.status = status;
        }
        // Type filter
        if (type) {
            filter.type = type;
        }
        // Country filter
        if (country) {
            filter.country = { $regex: country, $options: "i" };
        }
        // Search filter
        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: "i" } },
                { email: { $regex: search, $options: "i" } },
                { phone: { $regex: search, $options: "i" } },
                { country: { $regex: search, $options: "i" } },
                { visaType: { $regex: search, $options: "i" } },
            ];
        }
        return await pagination_1.default.paginateWithPopulate(visaBookingQuery_model_1.VisaBookingQuery, filter, {
            page,
            limit,
            sort: `${sortOrder === "desc" ? "-" : ""}${sortBy}`,
            ...(search && { search }),
        }, "");
    }
    // Get visa booking query by ID
    async getVisaBookingQueryById(id) {
        const query = await visaBookingQuery_model_1.VisaBookingQuery.findById(id);
        if (!query) {
            throw new ApiError_1.default(404, "Visa booking query not found");
        }
        return query;
    }
    // Update visa booking query status
    async updateVisaBookingQueryStatus(id, input) {
        const query = await visaBookingQuery_model_1.VisaBookingQuery.findById(id);
        if (!query) {
            throw new ApiError_1.default(404, "Visa booking query not found");
        }
        query.status = input.status;
        await query.save();
        return query;
    }
    // Delete visa booking query
    async deleteVisaBookingQuery(id) {
        console.log("Service: Attempting to delete query with ID:", id);
        const query = await visaBookingQuery_model_1.VisaBookingQuery.findById(id);
        if (!query) {
            console.log("Service: Query not found with ID:", id);
            throw new ApiError_1.default(404, "Visa booking query not found");
        }
        console.log("Service: Query found, deleting:", query);
        const result = await visaBookingQuery_model_1.VisaBookingQuery.findByIdAndDelete(id);
        console.log("Service: Delete result:", result);
    }
    // Get statistics
    async getVisaBookingQueryStats() {
        const [stats] = await visaBookingQuery_model_1.VisaBookingQuery.aggregate([
            {
                $group: {
                    _id: null,
                    total: { $sum: 1 },
                    pending: {
                        $sum: { $cond: [{ $eq: ["$status", "pending"] }, 1, 0] },
                    },
                    contacted: {
                        $sum: { $cond: [{ $eq: ["$status", "contacted"] }, 1, 0] },
                    },
                    closed: {
                        $sum: { $cond: [{ $eq: ["$status", "closed"] }, 1, 0] },
                    },
                },
            },
        ]);
        return stats || { total: 0, pending: 0, contacted: 0, closed: 0 };
    }
    // Get user's own visa booking queries
    async getMyVisaBookingQueries(userId) {
        const user = await auth_model_1.default.findById(userId);
        if (!user) {
            throw new ApiError_1.default(404, "User not found");
        }
        const userEmail = user.email.trim().toLowerCase();
        return await visaBookingQuery_model_1.VisaBookingQuery.find({
            email: {
                $regex: `^${userEmail.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`,
                $options: "i",
            },
        }).sort({ createdAt: -1 });
    }
}
exports.default = new VisaBookingQueryService();
//# sourceMappingURL=visaBookingQuery.service.js.map