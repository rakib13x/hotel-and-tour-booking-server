"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const TourCategory_1 = __importDefault(require("../../models/TourCategory"));
class TourCategoryService {
    async createTourCategory(input) {
        const tourCategory = new TourCategory_1.default(input);
        return await tourCategory.save();
    }
    async getTourCategories(query) {
        const { page = 1, limit = 10, search } = query;
        const skip = (page - 1) * limit;
        // Build filter object
        const filter = {};
        if (search) {
            filter.category_name = { $regex: search, $options: "i" };
        }
        const [tourCategories, total] = await Promise.all([
            TourCategory_1.default
                .find(filter)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),
            TourCategory_1.default.countDocuments(filter),
        ]);
        const pages = Math.ceil(total / limit);
        const hasNext = page < pages;
        const hasPrev = page > 1;
        return {
            data: tourCategories,
            pagination: {
                page,
                limit,
                total,
                pages,
                hasNext,
                hasPrev,
                ...(hasNext && { next: page + 1 }),
                ...(hasPrev && { prev: page - 1 }),
            },
        };
    }
    async getAllActiveTourCategories() {
        return await TourCategory_1.default.find({}).sort({ createdAt: -1 });
    }
    async getTourCategoryById(id) {
        const tourCategory = await TourCategory_1.default.findById(id);
        if (!tourCategory) {
            throw new Error("Tour category not found");
        }
        return tourCategory;
    }
    async updateTourCategory(id, input) {
        const tourCategory = await TourCategory_1.default.findByIdAndUpdate(id, { ...input }, { new: true, runValidators: true });
        if (!tourCategory) {
            throw new Error("Tour category not found");
        }
        return tourCategory;
    }
    async deleteTourCategory(id) {
        const result = await TourCategory_1.default.findByIdAndDelete(id);
        if (!result) {
            throw new Error("Tour category not found");
        }
    }
}
exports.default = new TourCategoryService();
//# sourceMappingURL=tourCategory.service.js.map