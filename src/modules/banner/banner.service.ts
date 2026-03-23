import { StatusCodes } from "http-status-codes";
import mongoose from "mongoose";
import ApiError from "../../utils/ApiError";
import { IBanner } from "./banner.interface";
import { Banner } from "../../models/banner.model";

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

export const BannerService = {
  createBannerIntoDB,
};
