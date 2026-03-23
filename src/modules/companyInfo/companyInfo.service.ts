import { StatusCodes } from "http-status-codes";
import mongoose from "mongoose";
import ApiError from "../../utils/ApiError";
import { ICompanyInfo } from "./companyInfo.interface";
import CompanyInfo from "./companyInfo.model";

/**
 * This module is responsible for creating company information in the database.
 *
 * @module companyInfo/companyInfo.service
 * @requires http-status-codes
 * @requires ../../../errors/ApiErrors
 * @requires ./companyInfo.interface
 * @requires ./companyInfo.model
 */

const createCompanyInfoToDB = async (
  payload: ICompanyInfo
): Promise<ICompanyInfo> => {
  const companyInfo = await CompanyInfo.create(payload);
  if (!companyInfo) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      "Failed to create company information"
    );
  }

  return companyInfo;
};

const getCompanyInfoFromDB = async (
  id?: string
): Promise<ICompanyInfo | ICompanyInfo[]> => {
  if (id) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "Invalid ID");
    }

    const companyInfo = await CompanyInfo.findById(id);
    if (!companyInfo) {
      throw new ApiError(
        StatusCodes.NOT_FOUND,
        "Company information not found"
      );
    }

    return companyInfo;
  }

  const companyInfos = await CompanyInfo.find({});
  return companyInfos;
};

const updateCompanyInfoToDB = async (
  id: string,
  payload: Partial<ICompanyInfo>
): Promise<ICompanyInfo> => {
  console.log("=== COMPANY INFO SERVICE UPDATE DEBUG ===");
  console.log("ID:", id);
  console.log("Payload received:", payload);
  console.log("Payload logo:", payload.logo);
  console.log("Payload logo type:", typeof payload.logo);
  console.log("Payload keys:", Object.keys(payload));
  console.log("===========================================");

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Invalid ID");
  }

  console.log("Updating company info in database...");
  const updatedCompanyInfo = await CompanyInfo.findByIdAndUpdate(
    { _id: id },
    payload,
    { new: true }
  );

  console.log("Database update result:", updatedCompanyInfo);

  if (!updatedCompanyInfo) {
    console.log("ERROR: Company information not found");
    throw new ApiError(StatusCodes.NOT_FOUND, "Company information not found");
  }

  console.log("=== COMPANY INFO UPDATED SUCCESSFULLY ===");
  return updatedCompanyInfo;
};

const deleteCompanyInfoFromDB = async (id: string): Promise<void> => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Invalid ID");
  }

  const companyInfo = await CompanyInfo.findByIdAndDelete(id);
  if (!companyInfo) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Company information not found");
  }
};

export const CompanyInfoService = {
  createCompanyInfoToDB,
  getCompanyInfoFromDB,
  updateCompanyInfoToDB,
  deleteCompanyInfoFromDB,
};
