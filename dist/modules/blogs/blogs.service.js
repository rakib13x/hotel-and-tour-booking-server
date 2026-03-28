"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlogService = void 0;
const http_status_codes_1 = require("http-status-codes");
const blogs_model_1 = require("../../models/blogs.model");
const category_model_1 = require("../../models/category.model");
const ApiError_1 = __importDefault(require("../../utils/ApiError"));
const checkValidID_1 = require("../../utils/checkValidID");
const pagination_1 = __importDefault(require("../../utils/pagination"));
const category_service_1 = require("./category.service");
const createBlogIntoDB = async (payload) => {
    // Extract category name from payload
    const { categoryName, ...blogData } = payload;
    if (!categoryName) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Category name is required");
    }
    // Find or create category
    const categoryId = await category_service_1.CategoryService.findOrCreateCategory(categoryName);
    // Create blog with category ID
    const blogPayload = {
        ...blogData,
        category: categoryId,
    };
    const result = await blogs_model_1.Blog.create(blogPayload);
    if (!result) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Failed to create blog");
    }
    return result;
};
const getAllBlogsFromDB = async (query) => {
    console.log(query, "this is for query");
    // Handle searchTerm parameter by mapping it to search
    if (query.searchTerm) {
        query.search = query.searchTerm;
        delete query.searchTerm;
    }
    // Handle category filtering by name instead of ObjectId
    let categoryFilter = {};
    if (query.category) {
        // Find category by name and get its ObjectId
        const category = await category_model_1.Category.findOne({ name: query.category });
        if (category) {
            categoryFilter = { category: category._id };
        }
        else {
            // If category not found, return empty result
            return {
                data: [],
                pagination: {
                    page: 1,
                    limit: parseInt(query.limit) || 10,
                    total: 0,
                    pages: 0,
                },
            };
        }
        // Remove category from query to avoid duplicate filtering
        delete query.category;
    }
    const apiFeatures = new pagination_1.default(blogs_model_1.Blog.find().populate("category", "name"), query);
    // Apply category filter if exists
    if (Object.keys(categoryFilter).length > 0) {
        apiFeatures.query = apiFeatures.query.find(categoryFilter);
    }
    // Search functionality
    apiFeatures.search(["title", "content", "tags"]);
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
const getSingleBlogFromDB = async (id) => {
    (0, checkValidID_1.checkValidID)(id);
    const result = await blogs_model_1.Blog.findById(id).populate("category", "name");
    if (!result) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "Blog not found");
    }
    return result;
};
const updateBlogIntoDB = async (id, payload) => {
    (0, checkValidID_1.checkValidID)(id);
    let updateData = { ...payload };
    // If categoryName is provided, find or create category
    if (payload.categoryName) {
        const categoryId = await category_service_1.CategoryService.findOrCreateCategory(payload.categoryName);
        updateData.category = categoryId;
        delete updateData.categoryName;
    }
    const result = await blogs_model_1.Blog.findByIdAndUpdate(id, updateData, {
        new: true,
    }).populate("category", "name");
    if (!result) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "Blog not found");
    }
    return result;
};
const deleteBlogFromDB = async (id) => {
    (0, checkValidID_1.checkValidID)(id);
    const result = await blogs_model_1.Blog.findByIdAndDelete(id);
    if (!result) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "Blog not found");
    }
    return result;
};
const getBlogStatsFromDB = async () => {
    const [totalCount, publishedCount, draftCount] = await Promise.all([
        blogs_model_1.Blog.countDocuments(),
        blogs_model_1.Blog.countDocuments({ status: "published" }),
        blogs_model_1.Blog.countDocuments({ status: "draft" }),
    ]);
    return {
        total: totalCount,
        published: publishedCount,
        draft: draftCount,
    };
};
exports.BlogService = {
    createBlogIntoDB,
    getAllBlogsFromDB,
    getSingleBlogFromDB,
    updateBlogIntoDB,
    deleteBlogFromDB,
    getBlogStatsFromDB,
};
//# sourceMappingURL=blogs.service.js.map