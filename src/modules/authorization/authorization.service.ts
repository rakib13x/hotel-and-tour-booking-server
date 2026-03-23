import { StatusCodes } from "http-status-codes";
import mongoose from "mongoose";

import ApiError from "../../utils/ApiError";
import { checkValidID } from "../../utils/checkValidID";
import APIFeatures from "../../utils/pagination";
import { IAuthorization } from "./authorization.interface";
import { Authorization } from "../../models/authorization.model";

interface CreateAuthorizationInput {
  image: string;
}

interface UpdateAuthorizationInput extends Partial<CreateAuthorizationInput> {}

const createAuthorizationIntoDB = async (
  payload: CreateAuthorizationInput,
): Promise<IAuthorization> => {
  const session = await mongoose.startSession();

  try {
    await session.startTransaction();

    const result = await Authorization.create([payload], { session });

    if (!result || result.length === 0) {
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        "Failed to create authorization",
      );
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

const getAllAuthorizationsFromDB = async (query: Record<string, any>) => {
  const apiFeatures = new APIFeatures(Authorization.find() as any, query);

  // Search functionality
  apiFeatures.search(["image"]);

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

const getSingleAuthorizationFromDB = async (
  id: string,
): Promise<IAuthorization | null> => {
  checkValidID(id);
  const result = await Authorization.findById(id);
  if (!result) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Authorization not found");
  }
  return result;
};

const updateAuthorizationIntoDB = async (
  id: string,
  payload: UpdateAuthorizationInput,
): Promise<IAuthorization | null> => {
  checkValidID(id);

  const session = await mongoose.startSession();

  try {
    await session.startTransaction();

    const result = await Authorization.findByIdAndUpdate(id, payload, {
      new: true,
      session,
    });

    if (!result) {
      throw new ApiError(StatusCodes.NOT_FOUND, "Authorization not found");
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

const deleteAuthorizationFromDB = async (
  id: string,
): Promise<IAuthorization | null> => {
  checkValidID(id);
  const result = await Authorization.findByIdAndDelete(id);
  if (!result) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Authorization not found");
  }
  return result;
};

export const AuthorizationService = {
  createAuthorizationIntoDB,
  getAllAuthorizationsFromDB,
  getSingleAuthorizationFromDB,
  updateAuthorizationIntoDB,
  deleteAuthorizationFromDB,
};
