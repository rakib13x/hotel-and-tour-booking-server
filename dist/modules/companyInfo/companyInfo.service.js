"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompanyInfoService = void 0;
const http_status_codes_1 = require("http-status-codes");
const mongoose_1 = __importDefault(require("mongoose"));
const ApiError_1 = __importDefault(require("../../utils/ApiError"));
const companyInfo_model_1 = __importDefault(require("./companyInfo.model"));
/**
 * This module is responsible for creating company information in the database.
 *
 * @module companyInfo/companyInfo.service
 * @requires http-status-codes
 * @requires ../../../errors/ApiErrors
 * @requires ./companyInfo.interface
 * @requires ./companyInfo.model
 */
const createCompanyInfoToDB = async (payload) => {
    const companyInfo = await companyInfo_model_1.default.create(payload);
    if (!companyInfo) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Failed to create company information");
    }
    return companyInfo;
};
const getCompanyInfoFromDB = async (id) => {
    if (id) {
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Invalid ID");
        }
        const companyInfo = await companyInfo_model_1.default.findById(id);
        if (!companyInfo) {
            throw new ApiError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "Company information not found");
        }
        return companyInfo;
    }
    const companyInfos = await companyInfo_model_1.default.find({});
    return companyInfos;
};
const updateCompanyInfoToDB = async (id, payload) => {
    console.log("=== COMPANY INFO SERVICE UPDATE DEBUG ===");
    console.log("ID:", id);
    console.log("Payload received:", payload);
    console.log("Payload logo:", payload.logo);
    console.log("Payload logo type:", typeof payload.logo);
    console.log("Payload keys:", Object.keys(payload));
    console.log("===========================================");
    if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Invalid ID");
    }
    console.log("Updating company info in database...");
    const updatedCompanyInfo = await companyInfo_model_1.default.findByIdAndUpdate({ _id: id }, payload, { new: true });
    console.log("Database update result:", updatedCompanyInfo);
    if (!updatedCompanyInfo) {
        console.log("ERROR: Company information not found");
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "Company information not found");
    }
    console.log("=== COMPANY INFO UPDATED SUCCESSFULLY ===");
    return updatedCompanyInfo;
};
const deleteCompanyInfoFromDB = async (id) => {
    if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Invalid ID");
    }
    const companyInfo = await companyInfo_model_1.default.findByIdAndDelete(id);
    if (!companyInfo) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "Company information not found");
    }
};
exports.CompanyInfoService = {
    createCompanyInfoToDB,
    getCompanyInfoFromDB,
    updateCompanyInfoToDB,
    deleteCompanyInfoFromDB,
};
//# sourceMappingURL=companyInfo.service.js.map