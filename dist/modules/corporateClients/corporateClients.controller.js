"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CorporateClientController = void 0;
const http_status_codes_1 = require("http-status-codes");
const cloudinary_1 = require("../../services/cloudinary");
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const corporateClients_service_1 = require("./corporateClients.service");
const createCorporateClient = (0, catchAsync_1.default)(async (req, res) => {
    // Handle file uploads
    console.log("=== CORPORATE CLIENT CREATION DEBUG ===");
    console.log("Request body:", req.body);
    console.log("Request files:", req.files);
    console.log("Content-Type:", req.headers["content-type"]);
    console.log("Request headers:", req.headers);
    const files = req.files;
    console.log("Files received:", files);
    console.log("Files keys:", Object.keys(files || {}));
    const logoFile = files?.coverImage?.[0];
    console.log("Logo file:", logoFile);
    console.log("Logo file buffer:", logoFile?.buffer);
    console.log("Logo file size:", logoFile?.size);
    console.log("Logo file mimetype:", logoFile?.mimetype);
    // Check if logo is provided
    if (!logoFile) {
        return (0, sendResponse_1.default)(res, http_status_codes_1.StatusCodes.BAD_REQUEST, {
            success: false,
            message: "Logo is required",
        });
    }
    // Upload logo to Cloudinary
    if (logoFile && logoFile.buffer) {
        console.log("Uploading logo to Cloudinary...");
        const logoUrl = await (0, cloudinary_1.uploadImageToCloudinary)(logoFile.buffer, "corporate-clients/logos");
        req.body.logo = logoUrl;
        console.log("Logo uploaded:", logoUrl);
    }
    const result = await corporateClients_service_1.CorporateClientService.createCorporateClientIntoDB(req.body);
    (0, sendResponse_1.default)(res, http_status_codes_1.StatusCodes.OK, {
        success: true,
        message: "Corporate client created successfully",
        data: result,
    });
});
const getAllCorporateClients = (0, catchAsync_1.default)(async (req, res) => {
    console.log("=== GET ALL CORPORATE CLIENTS CONTROLLER ===");
    console.log("Query params:", req.query);
    const result = await corporateClients_service_1.CorporateClientService.getAllCorporateClientsFromDB(req.query);
    console.log("Retrieved clients count:", result.length);
    console.log("Client orders:", result.map((c) => ({ id: c._id, name: c.name, order: c.order })));
    (0, sendResponse_1.default)(res, http_status_codes_1.StatusCodes.OK, {
        success: true,
        message: "Corporate clients retrieved successfully",
        data: result,
    });
});
const getSingleCorporateClient = (0, catchAsync_1.default)(async (req, res) => {
    const id = req.params.id;
    if (!id) {
        return (0, sendResponse_1.default)(res, http_status_codes_1.StatusCodes.BAD_REQUEST, {
            success: false,
            message: "ID is required",
        });
    }
    const result = await corporateClients_service_1.CorporateClientService.getSingleCorporateClientFromDB(id);
    if (!result) {
        return (0, sendResponse_1.default)(res, http_status_codes_1.StatusCodes.NOT_FOUND, {
            success: false,
            message: "Corporate client not found",
        });
    }
    (0, sendResponse_1.default)(res, http_status_codes_1.StatusCodes.OK, {
        success: true,
        message: "Corporate client retrieved successfully",
        data: result,
    });
});
const updateCorporateClient = (0, catchAsync_1.default)(async (req, res) => {
    const id = req.params.id;
    if (!id) {
        return (0, sendResponse_1.default)(res, http_status_codes_1.StatusCodes.BAD_REQUEST, {
            success: false,
            message: "ID is required",
        });
    }
    // Handle file upload
    const files = req.files;
    const logoFile = files?.coverImage?.[0];
    // Upload logo to Cloudinary if provided
    if (logoFile) {
        const logoUrl = await (0, cloudinary_1.uploadImageToCloudinary)(logoFile.buffer, "corporate-clients/logos");
        req.body.logo = logoUrl;
    }
    const result = await corporateClients_service_1.CorporateClientService.updateCorporateClientIntoDB(id, req.body);
    if (!result) {
        return (0, sendResponse_1.default)(res, http_status_codes_1.StatusCodes.NOT_FOUND, {
            success: false,
            message: "Corporate client not found",
        });
    }
    (0, sendResponse_1.default)(res, http_status_codes_1.StatusCodes.OK, {
        success: true,
        message: "Corporate client updated successfully",
        data: result,
    });
});
const deleteCorporateClient = (0, catchAsync_1.default)(async (req, res) => {
    const id = req.params.id;
    if (!id) {
        return (0, sendResponse_1.default)(res, http_status_codes_1.StatusCodes.BAD_REQUEST, {
            success: false,
            message: "ID is required",
        });
    }
    const result = await corporateClients_service_1.CorporateClientService.deleteCorporateClientFromDB(id);
    if (!result) {
        return (0, sendResponse_1.default)(res, http_status_codes_1.StatusCodes.NOT_FOUND, {
            success: false,
            message: "Corporate client not found",
        });
    }
    (0, sendResponse_1.default)(res, http_status_codes_1.StatusCodes.OK, {
        success: true,
        message: "Corporate client deleted successfully",
        data: result,
    });
});
// Public API for frontend
const getPublicCorporateClients = (0, catchAsync_1.default)(async (req, res) => {
    const result = await corporateClients_service_1.CorporateClientService.getPublicCorporateClientsFromDB();
    (0, sendResponse_1.default)(res, http_status_codes_1.StatusCodes.OK, {
        success: true,
        message: "Corporate clients retrieved successfully",
        data: result,
    });
});
// Reorder corporate clients (Admin only)
const reorderCorporateClients = (0, catchAsync_1.default)(async (req, res) => {
    const { clientIds } = req.body;
    console.log("=== REORDER CORPORATE CLIENTS CONTROLLER ===");
    console.log("Request body:", req.body);
    console.log("Client IDs:", clientIds);
    if (!Array.isArray(clientIds) || clientIds.length === 0) {
        return (0, sendResponse_1.default)(res, http_status_codes_1.StatusCodes.BAD_REQUEST, {
            success: false,
            message: "Client IDs array is required",
        });
    }
    const result = await corporateClients_service_1.CorporateClientService.reorderCorporateClientsIntoDB(clientIds);
    (0, sendResponse_1.default)(res, http_status_codes_1.StatusCodes.OK, {
        success: true,
        message: "Corporate clients reordered successfully",
        data: result,
    });
});
exports.CorporateClientController = {
    createCorporateClient,
    getAllCorporateClients,
    getSingleCorporateClient,
    updateCorporateClient,
    deleteCorporateClient,
    getPublicCorporateClients,
    reorderCorporateClients,
};
//# sourceMappingURL=corporateClients.controller.js.map