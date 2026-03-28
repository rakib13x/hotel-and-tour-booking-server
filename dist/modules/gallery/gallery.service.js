"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GalleryService = void 0;
const http_status_codes_1 = require("http-status-codes");
const gallery_model_1 = require("../../models/gallery.model");
const ApiError_1 = __importDefault(require("../../utils/ApiError"));
const checkValidID_1 = require("../../utils/checkValidID");
const pagination_1 = __importDefault(require("../../utils/pagination"));
// Category Services
const createCategoryIntoDB = async (payload) => {
    // Check if category already exists
    const existingCategory = await gallery_model_1.Category.findOne({
        name: payload.name,
    });
    if (existingCategory) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.CONFLICT, "Category already exists");
    }
    const result = await gallery_model_1.Category.create(payload);
    if (!result) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Failed to create category");
    }
    return result;
};
const getAllCategoriesFromDB = async (query) => {
    const apiFeatures = new pagination_1.default(gallery_model_1.Category.find(), query);
    // Search functionality
    apiFeatures.search(["name"]);
    // Filter functionality
    apiFeatures.filter();
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
const getActiveCategoriesFromDB = async () => {
    const result = await gallery_model_1.Category.find({ isActive: true }).sort({ name: 1 });
    return result;
};
const getSingleCategoryFromDB = async (id) => {
    (0, checkValidID_1.checkValidID)(id);
    const result = await gallery_model_1.Category.findById(id);
    if (!result) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "Category not found");
    }
    return result;
};
const updateCategoryIntoDB = async (id, payload) => {
    (0, checkValidID_1.checkValidID)(id);
    // Check if category name is being updated and if it already exists
    if (payload.name) {
        const existingCategory = await gallery_model_1.Category.findOne({
            name: payload.name,
            _id: { $ne: id },
        });
        if (existingCategory) {
            throw new ApiError_1.default(http_status_codes_1.StatusCodes.CONFLICT, "Category already exists");
        }
    }
    const result = await gallery_model_1.Category.findByIdAndUpdate(id, payload, {
        new: true,
    });
    if (!result) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "Category not found");
    }
    return result;
};
const deleteCategoryFromDB = async (id) => {
    (0, checkValidID_1.checkValidID)(id);
    // Check if category exists
    const category = await gallery_model_1.Category.findById(id);
    if (!category) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "Category not found");
    }
    // Get all subcategories for this category
    const subCategories = await gallery_model_1.SubCategory.find({ categoryId: id });
    // Delete all images in subcategories first
    for (const subCategory of subCategories) {
        await gallery_model_1.Image.deleteMany({ subCategoryId: subCategory._id });
    }
    // Delete all subcategories
    await gallery_model_1.SubCategory.deleteMany({ categoryId: id });
    // Finally delete the category
    const result = await gallery_model_1.Category.findByIdAndDelete(id);
    return result;
};
// SubCategory Services
const createSubCategoryIntoDB = async (payload) => {
    // Check if category exists
    const category = await gallery_model_1.Category.findById(payload.categoryId);
    if (!category) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "Category not found");
    }
    // Check if subcategory already exists in this category
    const existingSubCategory = await gallery_model_1.SubCategory.findOne({
        categoryId: payload.categoryId,
        name: payload.name,
    });
    if (existingSubCategory) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.CONFLICT, "SubCategory already exists in this category");
    }
    const result = await gallery_model_1.SubCategory.create(payload);
    if (!result) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Failed to create subcategory");
    }
    return result;
};
const getAllSubCategoriesFromDB = async (query) => {
    const apiFeatures = new pagination_1.default(gallery_model_1.SubCategory.find().populate("categoryId"), query);
    // Search functionality
    apiFeatures.search(["name"]);
    // Filter functionality
    apiFeatures.filter();
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
const getSubCategoriesByCategoryFromDB = async (categoryId) => {
    (0, checkValidID_1.checkValidID)(categoryId);
    const result = await gallery_model_1.SubCategory.find({ categoryId, isActive: true })
        .populate("categoryId")
        .sort({ name: 1 });
    return result;
};
const getSingleSubCategoryFromDB = async (id) => {
    (0, checkValidID_1.checkValidID)(id);
    const result = await gallery_model_1.SubCategory.findById(id).populate("categoryId");
    if (!result) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "SubCategory not found");
    }
    return result;
};
const updateSubCategoryIntoDB = async (id, payload) => {
    (0, checkValidID_1.checkValidID)(id);
    // Check if category exists (if categoryId is being updated)
    if (payload.categoryId) {
        const category = await gallery_model_1.Category.findById(payload.categoryId);
        if (!category) {
            throw new ApiError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "Category not found");
        }
    }
    // Check if subcategory name already exists in the category
    if (payload.name || payload.categoryId) {
        const currentSubCategory = await gallery_model_1.SubCategory.findById(id);
        const existingSubCategory = await gallery_model_1.SubCategory.findOne({
            categoryId: payload.categoryId || currentSubCategory?.categoryId,
            name: payload.name || currentSubCategory?.name,
            _id: { $ne: id },
        });
        if (existingSubCategory) {
            throw new ApiError_1.default(http_status_codes_1.StatusCodes.CONFLICT, "SubCategory already exists in this category");
        }
    }
    const result = await gallery_model_1.SubCategory.findByIdAndUpdate(id, payload, {
        new: true,
    }).populate("categoryId");
    if (!result) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "SubCategory not found");
    }
    return result;
};
const deleteSubCategoryFromDB = async (id) => {
    (0, checkValidID_1.checkValidID)(id);
    // Check if subcategory exists
    const subCategory = await gallery_model_1.SubCategory.findById(id);
    if (!subCategory) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "SubCategory not found");
    }
    // Delete all images in this subcategory first
    await gallery_model_1.Image.deleteMany({ subCategoryId: id });
    // Then delete the subcategory
    const result = await gallery_model_1.SubCategory.findByIdAndDelete(id);
    return result;
};
// Image Services
const createImageIntoDB = async (payload) => {
    console.log("=== GALLERY SERVICE DEBUG ===");
    console.log("Payload received:", payload);
    console.log("subCategoryId:", payload.subCategoryId);
    console.log("subCategoryId type:", typeof payload.subCategoryId);
    console.log("URL:", payload.url);
    console.log("=============================");
    // Check if subcategory exists
    const subCategory = await gallery_model_1.SubCategory.findById(payload.subCategoryId);
    console.log("Found subcategory:", subCategory);
    if (!subCategory) {
        console.log("ERROR: SubCategory not found with ID:", payload.subCategoryId);
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "SubCategory not found");
    }
    console.log("Creating image with payload:", payload);
    const result = await gallery_model_1.Image.create(payload);
    console.log("Image created result:", result);
    if (!result) {
        console.log("ERROR: Failed to create image");
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Failed to create image");
    }
    console.log("=== IMAGE CREATED SUCCESSFULLY ===");
    return result;
};
const getAllImagesFromDB = async (query) => {
    const apiFeatures = new pagination_1.default(gallery_model_1.Image.find().populate("subCategoryId"), query);
    // Search functionality
    apiFeatures.search(["altText"]);
    // Filter functionality
    apiFeatures.filter();
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
const getImagesBySubCategoryFromDB = async (subCategoryId) => {
    (0, checkValidID_1.checkValidID)(subCategoryId);
    const result = await gallery_model_1.Image.find({ subCategoryId, isActive: true })
        .populate("subCategoryId")
        .sort({ createdAt: -1 });
    return result;
};
const getSingleImageFromDB = async (id) => {
    (0, checkValidID_1.checkValidID)(id);
    const result = await gallery_model_1.Image.findById(id).populate("subCategoryId");
    if (!result) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "Image not found");
    }
    return result;
};
const updateImageIntoDB = async (id, payload) => {
    (0, checkValidID_1.checkValidID)(id);
    // Check if subcategory exists (if subCategoryId is being updated)
    if (payload.subCategoryId) {
        const subCategory = await gallery_model_1.SubCategory.findById(payload.subCategoryId);
        if (!subCategory) {
            throw new ApiError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "SubCategory not found");
        }
    }
    const result = await gallery_model_1.Image.findByIdAndUpdate(id, payload, {
        new: true,
    }).populate("subCategoryId");
    if (!result) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "Image not found");
    }
    return result;
};
const deleteImageFromDB = async (id) => {
    (0, checkValidID_1.checkValidID)(id);
    const result = await gallery_model_1.Image.findByIdAndDelete(id);
    if (!result) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "Image not found");
    }
    return result;
};
exports.GalleryService = {
    // Category services
    createCategoryIntoDB,
    getAllCategoriesFromDB,
    getActiveCategoriesFromDB,
    getSingleCategoryFromDB,
    updateCategoryIntoDB,
    deleteCategoryFromDB,
    // SubCategory services
    createSubCategoryIntoDB,
    getAllSubCategoriesFromDB,
    getSubCategoriesByCategoryFromDB,
    getSingleSubCategoryFromDB,
    updateSubCategoryIntoDB,
    deleteSubCategoryFromDB,
    // Image services
    createImageIntoDB,
    getAllImagesFromDB,
    getImagesBySubCategoryFromDB,
    getSingleImageFromDB,
    updateImageIntoDB,
    deleteImageFromDB,
};
//# sourceMappingURL=gallery.service.js.map