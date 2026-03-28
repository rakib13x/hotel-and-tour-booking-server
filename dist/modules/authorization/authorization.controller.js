"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthorizationController = void 0;
const http_status_codes_1 = require("http-status-codes");
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const authorization_service_1 = require("./authorization.service");
const createAuthorization = (0, catchAsync_1.default)(async (req, res) => {
    // Handle file uploads
    const files = req.files;
    const imageFiles = files || [];
    // Determine if this is FormData or JSON request
    const contentType = req.headers["content-type"];
    const isFormData = contentType && contentType.includes("multipart/form-data");
    // Prepare authorization data based on request type
    let authorizationData;
    if (isFormData) {
        // For FormData, data is directly in req.body
        authorizationData = {
            image: req.body.image || "",
        };
    }
    else {
        // For JSON, data is in req.body.body
        authorizationData = req.body.body;
    }
    // Validate that we have a file upload first
    if (imageFiles.length === 0) {
        return (0, sendResponse_1.default)(res, http_status_codes_1.StatusCodes.BAD_REQUEST, {
            success: false,
            message: "Image file is required",
        });
    }
    // File is already uploaded to Cloudinary by multer middleware
    // The path contains the Cloudinary URL
    if (imageFiles.length > 0 && imageFiles[0] && imageFiles[0].path) {
        authorizationData.image = imageFiles[0].path;
    }
    const result = await authorization_service_1.AuthorizationService.createAuthorizationIntoDB(authorizationData);
    (0, sendResponse_1.default)(res, http_status_codes_1.StatusCodes.CREATED, {
        success: true,
        message: "Authorization created successfully",
        data: result,
    });
});
const getAllAuthorizations = (0, catchAsync_1.default)(async (req, res) => {
    const result = await authorization_service_1.AuthorizationService.getAllAuthorizationsFromDB(req.query);
    (0, sendResponse_1.default)(res, http_status_codes_1.StatusCodes.OK, {
        success: true,
        message: "Authorizations retrieved successfully",
        data: result.data,
        pagination: result.pagination,
    });
});
const getSingleAuthorization = (0, catchAsync_1.default)(async (req, res) => {
    const id = req.params.id;
    if (!id) {
        return (0, sendResponse_1.default)(res, http_status_codes_1.StatusCodes.BAD_REQUEST, {
            success: false,
            message: "Authorization ID is required",
        });
    }
    const result = await authorization_service_1.AuthorizationService.getSingleAuthorizationFromDB(id);
    (0, sendResponse_1.default)(res, http_status_codes_1.StatusCodes.OK, {
        success: true,
        message: "Authorization retrieved successfully",
        data: result,
    });
});
const updateAuthorization = (0, catchAsync_1.default)(async (req, res) => {
    const id = req.params.id;
    if (!id) {
        return (0, sendResponse_1.default)(res, http_status_codes_1.StatusCodes.BAD_REQUEST, {
            success: false,
            message: "Authorization ID is required",
        });
    }
    // Handle file uploads
    const files = req.files;
    const imageFiles = files || [];
    // Determine if this is FormData or JSON request
    const contentType = req.headers["content-type"];
    const isFormData = contentType && contentType.includes("multipart/form-data");
    // Prepare authorization data based on request type
    let authorizationData;
    if (isFormData) {
        // For FormData, data is directly in req.body
        authorizationData = {
            image: req.body.image || "",
        };
    }
    else {
        // For JSON, data is in req.body.body
        authorizationData = req.body.body;
    }
    // File is already uploaded to Cloudinary by multer middleware
    // The path contains the Cloudinary URL
    if (imageFiles.length > 0 && imageFiles[0] && imageFiles[0].path) {
        authorizationData.image = imageFiles[0].path;
    }
    const result = await authorization_service_1.AuthorizationService.updateAuthorizationIntoDB(id, authorizationData);
    (0, sendResponse_1.default)(res, http_status_codes_1.StatusCodes.OK, {
        success: true,
        message: "Authorization updated successfully",
        data: result,
    });
});
const deleteAuthorization = (0, catchAsync_1.default)(async (req, res) => {
    const id = req.params.id;
    if (!id) {
        return (0, sendResponse_1.default)(res, http_status_codes_1.StatusCodes.BAD_REQUEST, {
            success: false,
            message: "Authorization ID is required",
        });
    }
    const result = await authorization_service_1.AuthorizationService.deleteAuthorizationFromDB(id);
    (0, sendResponse_1.default)(res, http_status_codes_1.StatusCodes.OK, {
        success: true,
        message: "Authorization deleted successfully",
        data: result,
    });
});
exports.AuthorizationController = {
    createAuthorization,
    getAllAuthorizations,
    getSingleAuthorization,
    updateAuthorization,
    deleteAuthorization,
};
//# sourceMappingURL=authorization.controller.js.map