import mongoose from "mongoose";
import ApiError from "./ApiError";
import { StatusCodes } from "http-status-codes";

export const checkValidID = (id: string): void => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Invalid ID format");
  }
};
