"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GalleryController = void 0;
const http_status_codes_1 = require("http-status-codes");
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const gallery_service_1 = require("./gallery.service");
// Category Controllers
const createCategory = (0, catchAsync_1.default)(async (req, res) => {
    const payload = {
        name: req.body.name,
        image: req.file?.path || req.body.image,
        isActive: req.body.isActive !== undefined ? req.body.isActive : true,
    };
    const result = await gallery_service_1.GalleryService.createCategoryIntoDB(payload);
    (0, sendResponse_1.default)(res, http_status_codes_1.StatusCodes.CREATED, {
        success: true,
        message: "Category created successfully",
        data: result,
    });
});
const getAllCategories = (0, catchAsync_1.default)(async (req, res) => {
    const result = await gallery_service_1.GalleryService.getAllCategoriesFromDB(req.query);
    (0, sendResponse_1.default)(res, http_status_codes_1.StatusCodes.OK, {
        success: true,
        message: "Categories retrieved successfully",
        data: result.data,
        pagination: result.pagination,
    });
});
const getActiveCategories = (0, catchAsync_1.default)(async (req, res) => {
    const result = await gallery_service_1.GalleryService.getActiveCategoriesFromDB();
    (0, sendResponse_1.default)(res, http_status_codes_1.StatusCodes.OK, {
        success: true,
        message: "Active categories retrieved successfully",
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
    const result = await gallery_service_1.GalleryService.getSingleCategoryFromDB(id);
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
    const payload = {};
    if (req.body.name)
        payload.name = req.body.name;
    if (req.body.isActive !== undefined)
        payload.isActive = req.body.isActive;
    if (req.file?.path)
        payload.image = req.file.path;
    const result = await gallery_service_1.GalleryService.updateCategoryIntoDB(id, payload);
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
    const result = await gallery_service_1.GalleryService.deleteCategoryFromDB(id);
    (0, sendResponse_1.default)(res, http_status_codes_1.StatusCodes.OK, {
        success: true,
        message: "Category deleted successfully",
        data: result,
    });
});
// SubCategory Controllers
const createSubCategory = (0, catchAsync_1.default)(async (req, res) => {
    const payload = {
        name: req.body.name,
        categoryId: req.body.categoryId,
        image: req.file?.path || req.body.image,
        isActive: req.body.isActive !== undefined ? req.body.isActive : true,
    };
    const result = await gallery_service_1.GalleryService.createSubCategoryIntoDB(payload);
    (0, sendResponse_1.default)(res, http_status_codes_1.StatusCodes.CREATED, {
        success: true,
        message: "SubCategory created successfully",
        data: result,
    });
});
const getAllSubCategories = (0, catchAsync_1.default)(async (req, res) => {
    const result = await gallery_service_1.GalleryService.getAllSubCategoriesFromDB(req.query);
    (0, sendResponse_1.default)(res, http_status_codes_1.StatusCodes.OK, {
        success: true,
        message: "SubCategories retrieved successfully",
        data: result.data,
        pagination: result.pagination,
    });
});
const getSubCategoriesByCategory = (0, catchAsync_1.default)(async (req, res) => {
    const categoryId = req.params.categoryId;
    if (!categoryId) {
        return (0, sendResponse_1.default)(res, http_status_codes_1.StatusCodes.BAD_REQUEST, {
            success: false,
            message: "Category ID is required",
        });
    }
    const result = await gallery_service_1.GalleryService.getSubCategoriesByCategoryFromDB(categoryId);
    (0, sendResponse_1.default)(res, http_status_codes_1.StatusCodes.OK, {
        success: true,
        message: "SubCategories retrieved successfully",
        data: result,
    });
});
const getSingleSubCategory = (0, catchAsync_1.default)(async (req, res) => {
    const id = req.params.id;
    if (!id) {
        return (0, sendResponse_1.default)(res, http_status_codes_1.StatusCodes.BAD_REQUEST, {
            success: false,
            message: "SubCategory ID is required",
        });
    }
    const result = await gallery_service_1.GalleryService.getSingleSubCategoryFromDB(id);
    (0, sendResponse_1.default)(res, http_status_codes_1.StatusCodes.OK, {
        success: true,
        message: "SubCategory retrieved successfully",
        data: result,
    });
});
const updateSubCategory = (0, catchAsync_1.default)(async (req, res) => {
    const id = req.params.id;
    if (!id) {
        return (0, sendResponse_1.default)(res, http_status_codes_1.StatusCodes.BAD_REQUEST, {
            success: false,
            message: "SubCategory ID is required",
        });
    }
    const payload = {};
    if (req.body.name)
        payload.name = req.body.name;
    if (req.body.categoryId)
        payload.categoryId = req.body.categoryId;
    if (req.body.isActive !== undefined)
        payload.isActive = req.body.isActive;
    if (req.file?.path)
        payload.image = req.file.path;
    const result = await gallery_service_1.GalleryService.updateSubCategoryIntoDB(id, payload);
    (0, sendResponse_1.default)(res, http_status_codes_1.StatusCodes.OK, {
        success: true,
        message: "SubCategory updated successfully",
        data: result,
    });
});
const deleteSubCategory = (0, catchAsync_1.default)(async (req, res) => {
    const id = req.params.id;
    if (!id) {
        return (0, sendResponse_1.default)(res, http_status_codes_1.StatusCodes.BAD_REQUEST, {
            success: false,
            message: "SubCategory ID is required",
        });
    }
    const result = await gallery_service_1.GalleryService.deleteSubCategoryFromDB(id);
    (0, sendResponse_1.default)(res, http_status_codes_1.StatusCodes.OK, {
        success: true,
        message: "SubCategory deleted successfully",
        data: result,
    });
});
// Image Controllers
const createImage = (0, catchAsync_1.default)(async (req, res) => {
    console.log("=== GALLERY IMAGE CREATE DEBUG ===");
    console.log("Request body:", req.body);
    console.log("Request file:", req.file);
    console.log("Request params:", req.params);
    console.log("Request query:", req.query);
    console.log("=====================================");
    // Check if file was uploaded
    if (!req.file) {
        console.log("ERROR: No file uploaded");
        return (0, sendResponse_1.default)(res, http_status_codes_1.StatusCodes.BAD_REQUEST, {
            success: false,
            message: "Image file is required",
        });
    }
    // Get image URL from Cloudinary upload
    const imageUrl = req.file.path;
    console.log("Image URL from Cloudinary:", imageUrl);
    // Create image data with URL from uploaded file
    const imageData = {
        ...req.body,
        url: imageUrl,
    };
    console.log("Final image data to save:", imageData);
    console.log("subCategoryId from body:", req.body.subCategoryId);
    console.log("subCategoryId type:", typeof req.body.subCategoryId);
    const result = await gallery_service_1.GalleryService.createImageIntoDB(imageData);
    console.log("Image created successfully:", result);
    (0, sendResponse_1.default)(res, http_status_codes_1.StatusCodes.CREATED, {
        success: true,
        message: "Image uploaded and created successfully",
        data: result,
    });
});
const getAllImages = (0, catchAsync_1.default)(async (req, res) => {
    const result = await gallery_service_1.GalleryService.getAllImagesFromDB(req.query);
    (0, sendResponse_1.default)(res, http_status_codes_1.StatusCodes.OK, {
        success: true,
        message: "Images retrieved successfully",
        data: result.data,
        pagination: result.pagination,
    });
});
const getImagesBySubCategory = (0, catchAsync_1.default)(async (req, res) => {
    const subCategoryId = req.params.subCategoryId;
    if (!subCategoryId) {
        return (0, sendResponse_1.default)(res, http_status_codes_1.StatusCodes.BAD_REQUEST, {
            success: false,
            message: "SubCategory ID is required",
        });
    }
    const result = await gallery_service_1.GalleryService.getImagesBySubCategoryFromDB(subCategoryId);
    (0, sendResponse_1.default)(res, http_status_codes_1.StatusCodes.OK, {
        success: true,
        message: "Images retrieved successfully",
        data: result,
    });
});
const getSingleImage = (0, catchAsync_1.default)(async (req, res) => {
    const id = req.params.id;
    if (!id) {
        return (0, sendResponse_1.default)(res, http_status_codes_1.StatusCodes.BAD_REQUEST, {
            success: false,
            message: "Image ID is required",
        });
    }
    const result = await gallery_service_1.GalleryService.getSingleImageFromDB(id);
    (0, sendResponse_1.default)(res, http_status_codes_1.StatusCodes.OK, {
        success: true,
        message: "Image retrieved successfully",
        data: result,
    });
});
const updateImage = (0, catchAsync_1.default)(async (req, res) => {
    const id = req.params.id;
    if (!id) {
        return (0, sendResponse_1.default)(res, http_status_codes_1.StatusCodes.BAD_REQUEST, {
            success: false,
            message: "Image ID is required",
        });
    }
    const result = await gallery_service_1.GalleryService.updateImageIntoDB(id, req.body);
    (0, sendResponse_1.default)(res, http_status_codes_1.StatusCodes.OK, {
        success: true,
        message: "Image updated successfully",
        data: result,
    });
});
const deleteImage = (0, catchAsync_1.default)(async (req, res) => {
    const id = req.params.id;
    if (!id) {
        return (0, sendResponse_1.default)(res, http_status_codes_1.StatusCodes.BAD_REQUEST, {
            success: false,
            message: "Image ID is required",
        });
    }
    const result = await gallery_service_1.GalleryService.deleteImageFromDB(id);
    (0, sendResponse_1.default)(res, http_status_codes_1.StatusCodes.OK, {
        success: true,
        message: "Image deleted successfully",
        data: result,
    });
});
exports.GalleryController = {
    // Category controllers
    createCategory,
    getAllCategories,
    getActiveCategories,
    getSingleCategory,
    updateCategory,
    deleteCategory,
    // SubCategory controllers
    createSubCategory,
    getAllSubCategories,
    getSubCategoriesByCategory,
    getSingleSubCategory,
    updateSubCategory,
    deleteSubCategory,
    // Image controllers
    createImage,
    getAllImages,
    getImagesBySubCategory,
    getSingleImage,
    updateImage,
    deleteImage,
};
//# sourceMappingURL=gallery.controller.js.map