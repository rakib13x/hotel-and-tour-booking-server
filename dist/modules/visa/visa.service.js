"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CountryVisaService = void 0;
const http_status_codes_1 = require("http-status-codes");
const visas_model_1 = require("../../models/visas.model");
const ApiError_1 = __importDefault(require("../../utils/ApiError"));
const checkValidID_1 = require("../../utils/checkValidID");
const pagination_1 = __importDefault(require("../../utils/pagination"));
const createCountryVisaIntoDB = async (payload) => {
    try {
        // Check if visa information already exists for this country
        const existingCountry = await visas_model_1.CountryVisa.findOne({
            countryName: payload.countryName,
        });
        if (existingCountry) {
            throw new ApiError_1.default(http_status_codes_1.StatusCodes.CONFLICT, "Visa information already exists for this country");
        }
        const result = await visas_model_1.CountryVisa.create([payload]);
        if (!result || result.length === 0) {
            throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Failed to create country visa");
        }
        return result[0];
    }
    catch (error) {
        throw error;
    }
};
const getAllCountryVisasFromDB = async (query) => {
    const apiFeatures = new pagination_1.default(visas_model_1.CountryVisa.find(), query);
    // Search functionality
    apiFeatures.search(["countryName", "visaTypes"]);
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
const getSingleCountryVisaFromDB = async (id) => {
    (0, checkValidID_1.checkValidID)(id);
    const result = await visas_model_1.CountryVisa.findById(id);
    if (!result) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "Country visa not found");
    }
    return result;
};
const getCountryVisaByCountryNameFromDB = async (countryName) => {
    const result = await visas_model_1.CountryVisa.findOne({
        countryName: { $regex: new RegExp(countryName, "i") },
    });
    // Return null if not found instead of throwing error
    // This allows frontend to handle "no data" gracefully
    return result;
};
const updateCountryVisaIntoDB = async (id, payload) => {
    (0, checkValidID_1.checkValidID)(id);
    try {
        // Check if country name is being updated and if visa info already exists for new country
        if (payload.countryName) {
            const existingCountry = await visas_model_1.CountryVisa.findOne({
                countryName: payload.countryName,
                _id: { $ne: id },
            });
            if (existingCountry) {
                throw new ApiError_1.default(http_status_codes_1.StatusCodes.CONFLICT, "Visa information already exists for this country");
            }
        }
        const result = await visas_model_1.CountryVisa.findByIdAndUpdate(id, payload, {
            new: true,
        });
        if (!result) {
            throw new ApiError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "Country visa not found");
        }
        return result;
    }
    catch (error) {
        throw error;
    }
};
const deleteCountryVisaFromDB = async (id) => {
    (0, checkValidID_1.checkValidID)(id);
    const result = await visas_model_1.CountryVisa.findByIdAndDelete(id);
    if (!result) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "Country visa not found");
    }
    return result;
};
const getActiveCountryVisasFromDB = async () => {
    const result = await visas_model_1.CountryVisa.find({ isActive: true }).sort({
        countryName: 1,
    });
    return result;
};
const toggleCountryVisaStatusInDB = async (id, isActive) => {
    (0, checkValidID_1.checkValidID)(id);
    const result = await visas_model_1.CountryVisa.findByIdAndUpdate(id, { isActive }, { new: true });
    if (!result) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "Country visa not found");
    }
    return result;
};
const getCountryVisasByVisaTypeFromDB = async (visaType) => {
    const result = await visas_model_1.CountryVisa.find({
        visaTypes: { $in: [visaType] },
        isActive: true,
    }).sort({ countryName: 1 });
    return result;
};
exports.CountryVisaService = {
    createCountryVisaIntoDB,
    getAllCountryVisasFromDB,
    getSingleCountryVisaFromDB,
    getCountryVisaByCountryNameFromDB,
    updateCountryVisaIntoDB,
    deleteCountryVisaFromDB,
    getActiveCountryVisasFromDB,
    toggleCountryVisaStatusInDB,
    getCountryVisasByVisaTypeFromDB,
};
//# sourceMappingURL=visa.service.js.map