"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlogController = void 0;
const http_status_codes_1 = require("http-status-codes");
const cloudinary_1 = require("../../services/cloudinary");
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const blogs_service_1 = require("./blogs.service");
const category_service_1 = require("./category.service");
const createBlog = (0, catchAsync_1.default)(async (req, res) => {
    // Handle file uploads
    console.log("=== BLOG CREATION DEBUG ===");
    console.log("Request body:", req.body);
    console.log("Request files:", req.files);
    console.log("Content-Type:", req.headers["content-type"]);
    console.log("Request headers:", req.headers);
    const files = req.files;
    console.log("Files received:", files);
    console.log("Files keys:", Object.keys(files || {}));
    const coverImageFile = files?.coverImage?.[0];
    const blogImageFiles = files?.images || [];
    console.log("Cover image file:", coverImageFile);
    console.log("Cover image file buffer:", coverImageFile?.buffer);
    console.log("Cover image file size:", coverImageFile?.size);
    console.log("Cover image file mimetype:", coverImageFile?.mimetype);
    console.log("Blog image files:", blogImageFiles);
    // Check if cover image is provided
    if (!coverImageFile) {
        return (0, sendResponse_1.default)(res, http_status_codes_1.StatusCodes.BAD_REQUEST, {
            success: false,
            message: "Cover image is required",
        });
    }
    // Upload cover image to Cloudinary
    if (coverImageFile && coverImageFile.buffer) {
        console.log("Uploading cover image to Cloudinary...");
        const coverImageUrl = await (0, cloudinary_1.uploadImageToCloudinary)(coverImageFile.buffer, "blogs/cover-images");
        req.body.coverImage = coverImageUrl;
        console.log("Cover image uploaded:", coverImageUrl);
    }
    // Handle blog images
    if (blogImageFiles.length > 0) {
        const blogImageUrls = await Promise.all(blogImageFiles.map((file) => (0, cloudinary_1.uploadImageToCloudinary)(file.buffer, "blogs/images")));
        req.body.images = blogImageUrls;
    }
    else {
        req.body.images = [];
    }
    console.log(req.body, "this is req.body after processing");
    const result = await blogs_service_1.BlogService.createBlogIntoDB(req.body);
    (0, sendResponse_1.default)(res, http_status_codes_1.StatusCodes.OK, {
        success: true,
        message: "Blog created successfully",
        data: result,
    });
});
const getAllBlogs = (0, catchAsync_1.default)(async (req, res) => {
    const result = await blogs_service_1.BlogService.getAllBlogsFromDB(req.query);
    (0, sendResponse_1.default)(res, http_status_codes_1.StatusCodes.OK, {
        success: true,
        message: "Blogs retrieved successfully",
        data: result.data,
        pagination: result.pagination,
    });
});
const getSingleBlog = (0, catchAsync_1.default)(async (req, res) => {
    const id = req.params.id;
    if (!id) {
        return (0, sendResponse_1.default)(res, http_status_codes_1.StatusCodes.BAD_REQUEST, {
            success: false,
            message: "Blog ID is required",
        });
    }
    const result = await blogs_service_1.BlogService.getSingleBlogFromDB(id);
    (0, sendResponse_1.default)(res, http_status_codes_1.StatusCodes.OK, {
        success: true,
        message: "Blog retrieved successfully",
        data: result,
    });
});
const updateBlog = (0, catchAsync_1.default)(async (req, res) => {
    const id = req.params.id;
    if (!id) {
        return (0, sendResponse_1.default)(res, http_status_codes_1.StatusCodes.BAD_REQUEST, {
            success: false,
            message: "Blog ID is required",
        });
    }
    // Handle file uploads
    const files = req.files;
    const coverImageFile = files?.coverImage?.[0];
    const blogImageFiles = files?.images || [];
    // Upload cover image to Cloudinary if provided
    if (coverImageFile) {
        const coverImageUrl = await (0, cloudinary_1.uploadImageToCloudinary)(coverImageFile.buffer, "blogs/cover-images");
        req.body.coverImage = coverImageUrl;
    }
    // Upload new blog images to Cloudinary if provided
    if (blogImageFiles.length > 0) {
        const blogImageUrls = await Promise.all(blogImageFiles.map((file) => (0, cloudinary_1.uploadImageToCloudinary)(file.buffer, "blogs/images")));
        // Append new images to existing ones
        req.body.images = [...(req.body.images || []), ...blogImageUrls];
    }
    const result = await blogs_service_1.BlogService.updateBlogIntoDB(id, req.body);
    (0, sendResponse_1.default)(res, http_status_codes_1.StatusCodes.OK, {
        success: true,
        message: "Blog updated successfully",
        data: result,
    });
});
const deleteBlog = (0, catchAsync_1.default)(async (req, res) => {
    const id = req.params.id;
    if (!id) {
        return (0, sendResponse_1.default)(res, http_status_codes_1.StatusCodes.BAD_REQUEST, {
            success: false,
            message: "Blog ID is required",
        });
    }
    const result = await blogs_service_1.BlogService.deleteBlogFromDB(id);
    (0, sendResponse_1.default)(res, http_status_codes_1.StatusCodes.OK, {
        success: true,
        message: "Blog deleted successfully",
        data: result,
    });
});
const getBlogStats = (0, catchAsync_1.default)(async (req, res) => {
    const result = await blogs_service_1.BlogService.getBlogStatsFromDB();
    (0, sendResponse_1.default)(res, http_status_codes_1.StatusCodes.OK, {
        success: true,
        message: "Blog statistics retrieved successfully",
        data: result,
    });
});
const getAllCategories = (0, catchAsync_1.default)(async (req, res) => {
    const result = await category_service_1.CategoryService.getAllCategories();
    (0, sendResponse_1.default)(res, http_status_codes_1.StatusCodes.OK, {
        success: true,
        message: "Categories retrieved successfully",
        data: result,
    });
});
// Category Management Endpoints
const createCategory = (0, catchAsync_1.default)(async (req, res) => {
    const result = await category_service_1.CategoryService.createCategory(req.body);
    (0, sendResponse_1.default)(res, http_status_codes_1.StatusCodes.CREATED, {
        success: true,
        message: "Category created successfully",
        data: result,
    });
});
const getSingleCategory = (0, catchAsync_1.default)(async (req, res) => {
    const id = req.params.id;
    if (!id) {
        return (0, sendResponse_1.default)(res, http_status_codes_1.StatusCodes.BAD_REQUEST, {
            success: false,
            message: "Category ID is required",
        });
    }
    const result = await category_service_1.CategoryService.getSingleCategory(id);
    (0, sendResponse_1.default)(res, http_status_codes_1.StatusCodes.OK, {
        success: true,
        message: "Category retrieved successfully",
        data: result,
    });
});
const updateCategory = (0, catchAsync_1.default)(async (req, res) => {
    const id = req.params.id;
    if (!id) {
        return (0, sendResponse_1.default)(res, http_status_codes_1.StatusCodes.BAD_REQUEST, {
            success: false,
            message: "Category ID is required",
        });
    }
    const result = await category_service_1.CategoryService.updateCategory(id, req.body);
    (0, sendResponse_1.default)(res, http_status_codes_1.StatusCodes.OK, {
        success: true,
        message: "Category updated successfully",
        data: result,
    });
});
const deleteCategory = (0, catchAsync_1.default)(async (req, res) => {
    const id = req.params.id;
    if (!id) {
        return (0, sendResponse_1.default)(res, http_status_codes_1.StatusCodes.BAD_REQUEST, {
            success: false,
            message: "Category ID is required",
        });
    }
    const result = await category_service_1.CategoryService.deleteCategory(id);
    (0, sendResponse_1.default)(res, http_status_codes_1.StatusCodes.OK, {
        success: true,
        message: "Category deleted successfully",
        data: result,
    });
});
exports.BlogController = {
    createBlog,
    getAllBlogs,
    getSingleBlog,
    updateBlog,
    deleteBlog,
    getBlogStats,
    getAllCategories,
    createCategory,
    getSingleCategory,
    updateCategory,
    deleteCategory,
};
//# sourceMappingURL=blogs.controller.js.map