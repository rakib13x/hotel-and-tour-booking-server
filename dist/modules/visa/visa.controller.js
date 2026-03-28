"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CountryVisaController = void 0;
const http_status_codes_1 = require("http-status-codes");
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const visa_service_1 = require("./visa.service");
const createCountryVisa = (0, catchAsync_1.default)(async (req, res) => {
    const result = await visa_service_1.CountryVisaService.createCountryVisaIntoDB(req.body);
    (0, sendResponse_1.default)(res, http_status_codes_1.StatusCodes.CREATED, {
        success: true,
        message: "Country visa created successfully",
        data: result,
    });
});
const getAllCountryVisas = (0, catchAsync_1.default)(async (req, res) => {
    const result = await visa_service_1.CountryVisaService.getAllCountryVisasFromDB(req.query);
    (0, sendResponse_1.default)(res, http_status_codes_1.StatusCodes.OK, {
        success: true,
        message: "Country visas retrieved successfully",
        data: result.data,
        pagination: result.pagination,
    });
});
const getActiveCountryVisas = (0, catchAsync_1.default)(async (req, res) => {
    const result = await visa_service_1.CountryVisaService.getActiveCountryVisasFromDB();
    (0, sendResponse_1.default)(res, http_status_codes_1.StatusCodes.OK, {
        success: true,
        message: "Active country visas retrieved successfully",
        data: result,
    });
});
const getSingleCountryVisa = (0, catchAsync_1.default)(async (req, res) => {
    const id = req.params.id;
    if (!id) {
        return (0, sendResponse_1.default)(res, http_status_codes_1.StatusCodes.BAD_REQUEST, {
            success: false,
            message: "Country visa ID is required",
        });
    }
    const result = await visa_service_1.CountryVisaService.getSingleCountryVisaFromDB(id);
    (0, sendResponse_1.default)(res, http_status_codes_1.StatusCodes.OK, {
        success: true,
        message: "Country visa retrieved successfully",
        data: result,
    });
});
const getCountryVisaByCountryName = (0, catchAsync_1.default)(async (req, res) => {
    const countryName = req.params.countryName;
    if (!countryName) {
        return (0, sendResponse_1.default)(res, http_status_codes_1.StatusCodes.BAD_REQUEST, {
            success: false,
            message: "Country name is required",
        });
    }
    const result = await visa_service_1.CountryVisaService.getCountryVisaByCountryNameFromDB(countryName);
    (0, sendResponse_1.default)(res, http_status_codes_1.StatusCodes.OK, {
        success: true,
        message: "Country visa retrieved successfully",
        data: result,
    });
});
const getCountryVisasByVisaType = (0, catchAsync_1.default)(async (req, res) => {
    const visaType = req.params.visaType;
    if (!visaType) {
        return (0, sendResponse_1.default)(res, http_status_codes_1.StatusCodes.BAD_REQUEST, {
            success: false,
            message: "Visa type is required",
        });
    }
    const result = await visa_service_1.CountryVisaService.getCountryVisasByVisaTypeFromDB(visaType);
    (0, sendResponse_1.default)(res, http_status_codes_1.StatusCodes.OK, {
        success: true,
        message: "Country visas retrieved successfully",
        data: result,
    });
});
const updateCountryVisa = (0, catchAsync_1.default)(async (req, res) => {
    const id = req.params.id;
    if (!id) {
        return (0, sendResponse_1.default)(res, http_status_codes_1.StatusCodes.BAD_REQUEST, {
            success: false,
            message: "Country visa ID is required",
        });
    }
    const result = await visa_service_1.CountryVisaService.updateCountryVisaIntoDB(id, req.body);
    (0, sendResponse_1.default)(res, http_status_codes_1.StatusCodes.OK, {
        success: true,
        message: "Country visa updated successfully",
        data: result,
    });
});
const deleteCountryVisa = (0, catchAsync_1.default)(async (req, res) => {
    const id = req.params.id;
    if (!id) {
        return (0, sendResponse_1.default)(res, http_status_codes_1.StatusCodes.BAD_REQUEST, {
            success: false,
            message: "Country visa ID is required",
        });
    }
    const result = await visa_service_1.CountryVisaService.deleteCountryVisaFromDB(id);
    (0, sendResponse_1.default)(res, http_status_codes_1.StatusCodes.OK, {
        success: true,
        message: "Country visa deleted successfully",
        data: result,
    });
});
const toggleCountryVisaStatus = (0, catchAsync_1.default)(async (req, res) => {
    const id = req.params.id;
    const { isActive } = req.body;
    if (!id) {
        return (0, sendResponse_1.default)(res, http_status_codes_1.StatusCodes.BAD_REQUEST, {
            success: false,
            message: "Country visa ID is required",
        });
    }
    if (typeof isActive !== "boolean") {
        return (0, sendResponse_1.default)(res, http_status_codes_1.StatusCodes.BAD_REQUEST, {
            success: false,
            message: "isActive must be a boolean value",
        });
    }
    const result = await visa_service_1.CountryVisaService.toggleCountryVisaStatusInDB(id, isActive);
    (0, sendResponse_1.default)(res, http_status_codes_1.StatusCodes.OK, {
        success: true,
        message: `Country visa ${isActive ? "activated" : "deactivated"} successfully`,
        data: result,
    });
});
exports.CountryVisaController = {
    createCountryVisa,
    getAllCountryVisas,
    getActiveCountryVisas,
    getSingleCountryVisa,
    getCountryVisaByCountryName,
    getCountryVisasByVisaType,
    updateCountryVisa,
    deleteCountryVisa,
    toggleCountryVisaStatus,
};
//# sourceMappingURL=visa.controller.js.map