import ApiError from "../../utils/ApiError";
import { IPolicyPage } from "./policyPage.interface";
import { PolicyPage } from "../../models/policyPage.model";
import { StatusCodes } from "http-status-codes";
import APIFeatures from "../../utils/pagination";
import { checkValidID } from "../../utils/checkValidID";
import mongoose from "mongoose";

const createPolicyPageIntoDB = async (payload: IPolicyPage): Promise<IPolicyPage> => {
  const session = await mongoose.startSession();
  
  try {
    await session.startTransaction();
    
    // Check if a policy page with this slug already exists
    const existingPolicyPage = await PolicyPage.findOne({ slug: payload.slug }).session(session);
    if (existingPolicyPage) {
      throw new ApiError(StatusCodes.CONFLICT, `Policy page with slug '${payload.slug}' already exists`);
    }
    
    const result = await PolicyPage.create([payload], { session });
    
    if (!result || result.length === 0) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "Failed to create policy page");
    }
    
    await session.commitTransaction();
    return result[0]!;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    await session.endSession();
  }
};

const getAllPolicyPagesFromDB = async (query: Record<string, any>) => {
  const apiFeatures = new APIFeatures(PolicyPage.find(), query);
  
  // Search functionality
  apiFeatures.search(['slug', 'content']);
  
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

const getSinglePolicyPageFromDB = async (id: string): Promise<IPolicyPage | null> => {
  checkValidID(id);
  const result = await PolicyPage.findById(id);
  if (!result) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Policy page not found");
  }
  return result;
};

const getPolicyPageBySlugFromDB = async (slug: string): Promise<IPolicyPage | null> => {
  const result = await PolicyPage.findOne({ slug });
  if (!result) {
    throw new ApiError(StatusCodes.NOT_FOUND, `Policy page with slug '${slug}' not found`);
  }
  return result;
};

const updatePolicyPageIntoDB = async (id: string, payload: Partial<IPolicyPage>): Promise<IPolicyPage | null> => {
  checkValidID(id);
  
  const session = await mongoose.startSession();
  
  try {
    await session.startTransaction();
    
    // If slug is being updated, check for conflicts
    if (payload.slug) {
      const existingPolicyPage = await PolicyPage.findOne({ 
        slug: payload.slug, 
        _id: { $ne: id } 
      }).session(session);
      
      if (existingPolicyPage) {
        throw new ApiError(StatusCodes.CONFLICT, `Policy page with slug '${payload.slug}' already exists`);
      }
    }
    
    const result = await PolicyPage.findByIdAndUpdate(id, payload, { new: true, session });
    
    if (!result) {
      throw new ApiError(StatusCodes.NOT_FOUND, "Policy page not found");
    }
    
    await session.commitTransaction();
    return result;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    await session.endSession();
  }
};

const deletePolicyPageFromDB = async (id: string): Promise<IPolicyPage | null> => {
  checkValidID(id);
  const result = await PolicyPage.findByIdAndDelete(id);
  if (!result) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Policy page not found");
  }
  return result;
};

export const PolicyPageService = {
  createPolicyPageIntoDB,
  getAllPolicyPagesFromDB,
  getSinglePolicyPageFromDB,
  getPolicyPageBySlugFromDB,
  updatePolicyPageIntoDB,
  deletePolicyPageFromDB,
};

