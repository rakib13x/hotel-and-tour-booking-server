import { StatusCodes } from "http-status-codes";
import mongoose from "mongoose";
import ApiError from "../../utils/ApiError";
import { IBanner } from "./banner.interface";
import { Banner } from "../../models/banner.model";
import { checkValidID } from "../../utils/checkValidID";
import APIFeatures from "../../utils/pagination";

interface CreateBannerInput {
  title: string;
  description: string;
  backgroundImage: string[];
  isActive?: boolean;
}

interface UpdateBannerInput extends Partial<CreateBannerInput> {}

const createBannerIntoDB = async (
  payload: CreateBannerInput,
): Promise<IBanner> => {
  const session = await mongoose.startSession();

  try {
    await session.startTransaction();

    const result = await Banner.create([payload], { session });

    if (!result || result.length === 0) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "Failed to create banner");
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

const getAllBannersFromDB = async (query: Record<string, any>) => {
  const apiFeatures = new APIFeatures(Banner.find(), query);

  // Search functionality
  apiFeatures.search(["title", "description"]);

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

const getSingleBannerFromDB = async (id: string): Promise<IBanner | null> => {
  checkValidID(id);
  const result = await Banner.findById(id);
  if (!result) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Banner not found");
  }
  return result;
};

const updateBannerIntoDB = async (
  id: string,
  payload: UpdateBannerInput,
): Promise<IBanner | null> => {
  checkValidID(id);

  const session = await mongoose.startSession();

  try {
    await session.startTransaction();

    const result = await Banner.findByIdAndUpdate(id, payload, {
      new: true,
      session,
    });

    if (!result) {
      throw new ApiError(StatusCodes.NOT_FOUND, "Banner not found");
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

const getActiveBannersFromDB = async (): Promise<IBanner[]> => {
  const result = await Banner.find({ isActive: true }).sort({ createdAt: -1 });
  return result;
};

export const BannerService = {
  createBannerIntoDB,
  getAllBannersFromDB,
  getSingleBannerFromDB,
  updateBannerIntoDB,
  getActiveBannersFromDB,
};
