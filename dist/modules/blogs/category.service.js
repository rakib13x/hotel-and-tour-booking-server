"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryService = void 0;
const http_status_codes_1 = require("http-status-codes");
const ApiError_1 = __importDefault(require("../../utils/ApiError"));
const checkValidID_1 = require("../../utils/checkValidID");
const category_model_1 = require("../../models/category.model");
const findOrCreateCategory = async (categoryName) => {
    // First, try to find existing category
    let category = await category_model_1.Category.findOne({ name: categoryName });
    if (category) {
        return category._id;
    }
    // If category doesn't exist, create it
    const newCategory = await category_model_1.Category.create({ name: categoryName });
    return newCategory._id;
};
const getAllCategories = async () => {
    const categories = await category_model_1.Category.find().sort({ name: 1 });
    return categories;
};
const createCategory = async (payload) => {
    // Check if category already exists
    const existingCategory = await category_model_1.Category.findOne({ name: payload.name });
    if (existingCategory) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.CONFLICT, "Category already exists");
    }
    const result = await category_model_1.Category.create(payload);
    return result;
};
const getSingleCategory = async (id) => {
    (0, checkValidID_1.checkValidID)(id);
    const result = await category_model_1.Category.findById(id);
    if (!result) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "Category not found");
    }
    return result;
};
const updateCategory = async (id, payload) => {
    (0, checkValidID_1.checkValidID)(id);
    // Check if category with new name already exists (excluding current category)
    const existingCategory = await category_model_1.Category.findOne({
        name: payload.name,
        _id: { $ne: id },
    });
    if (existingCategory) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.CONFLICT, "Category with this name already exists");
    }
    const result = await category_model_1.Category.findByIdAndUpdate(id, payload, { new: true });
    if (!result) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "Category not found");
    }
    return result;
};
const deleteCategory = async (id) => {
    (0, checkValidID_1.checkValidID)(id);
    // Check if category is being used by any blog
    const { Blog } = await Promise.resolve().then(() => __importStar(require("../../models/blogs.model")));
    const blogsUsingCategory = await Blog.findOne({ category: id });
    if (blogsUsingCategory) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Cannot delete category that is being used by blogs");
    }
    const result = await category_model_1.Category.findByIdAndDelete(id);
    if (!result) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "Category not found");
    }
    return result;
};
exports.CategoryService = {
    findOrCreateCategory,
    getAllCategories,
    createCategory,
    getSingleCategory,
    updateCategory,
    deleteCategory,
};
//# sourceMappingURL=category.service.js.map