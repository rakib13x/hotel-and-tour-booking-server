"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const customTourQuery_model_1 = require("../../models/customTourQuery.model");
const ApiError_1 = __importDefault(require("../../utils/ApiError"));
const pagination_1 = __importDefault(require("../../utils/pagination"));
class CustomTourQueryService {
    // Create custom tour query
    async createCustomTourQuery(input) {
        const query = new customTourQuery_model_1.CustomTourQuery(input);
        await query.save();
        return query;
    }
    // Get all custom tour queries with pagination
    async getCustomTourQueries(options) {
        const { page = 1, limit = 10, search, status, sortBy = "createdAt", sortOrder = "desc", } = options;
        const filter = {};
        // Status filter
        if (status) {
            filter.status = status;
        }
        // Search filter
        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: "i" } },
                { email: { $regex: search, $options: "i" } },
                { phone: { $regex: search, $options: "i" } },
                { tourTitle: { $regex: search, $options: "i" } },
            ];
        }
        return await pagination_1.default.paginateWithPopulate(customTourQuery_model_1.CustomTourQuery, filter, {
            page,
            limit,
            sort: `${sortOrder === "desc" ? "-" : ""}${sortBy}`,
            ...(search && { search }),
        }, "tourId");
    }
    // Get custom tour query by ID
    async getCustomTourQueryById(id) {
        const query = await customTourQuery_model_1.CustomTourQuery.findById(id).populate("tourId");
        if (!query) {
            throw new ApiError_1.default(404, "Custom tour query not found");
        }
        return query;
    }
    // Update custom tour query
    async updateCustomTourQuery(id, input) {
        const query = await customTourQuery_model_1.CustomTourQuery.findById(id);
        if (!query) {
            throw new ApiError_1.default(404, "Custom tour query not found");
        }
        Object.assign(query, input);
        await query.save();
        return query;
    }
    // Delete custom tour query
    async deleteCustomTourQuery(id) {
        const query = await customTourQuery_model_1.CustomTourQuery.findById(id);
        if (!query) {
            throw new ApiError_1.default(404, "Custom tour query not found");
        }
        await customTourQuery_model_1.CustomTourQuery.findByIdAndDelete(id);
    }
    // Get statistics
    async getCustomTourQueryStats() {
        const [stats] = await customTourQuery_model_1.CustomTourQuery.aggregate([
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
}
exports.default = new CustomTourQueryService();
//# sourceMappingURL=customTourQuery.service.js.map