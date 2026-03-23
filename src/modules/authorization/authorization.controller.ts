import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { AuthorizationService } from "./authorization.service";

const createAuthorization = catchAsync(async (req: Request, res: Response) => {
  // Handle file uploads
  const files = req.files as Express.Multer.File[];
  const imageFiles = files || [];

  // Determine if this is FormData or JSON request
  const contentType = req.headers["content-type"];
  const isFormData = contentType && contentType.includes("multipart/form-data");

  // Prepare authorization data based on request type
  let authorizationData;
  if (isFormData) {
    // For FormData, data is directly in req.body
    authorizationData = {
      image: req.body.image || "",
    };
  } else {
    // For JSON, data is in req.body.body
    authorizationData = req.body.body;
  }

  // Validate that we have a file upload first
  if (imageFiles.length === 0) {
    return sendResponse(res, StatusCodes.BAD_REQUEST, {
      success: false,
      message: "Image file is required",
    });
  }

  // File is already uploaded to Cloudinary by multer middleware
  // The path contains the Cloudinary URL
  if (imageFiles.length > 0 && imageFiles[0] && imageFiles[0].path) {
    authorizationData.image = imageFiles[0].path;
  }

  const result = await AuthorizationService.createAuthorizationIntoDB(
    authorizationData
  );
  sendResponse(res, StatusCodes.CREATED, {
    success: true,
    message: "Authorization created successfully",
    data: result,
  });
});

const getAllAuthorizations = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthorizationService.getAllAuthorizationsFromDB(
    req.query
  );
  sendResponse(res, StatusCodes.OK, {
    success: true,
    message: "Authorizations retrieved successfully",
    data: result.data,
    pagination: result.pagination,
  });
});

const getSingleAuthorization = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id as string;
    if (!id) {
      return sendResponse(res, StatusCodes.BAD_REQUEST, {
        success: false,
        message: "Authorization ID is required",
      });
    }
    const result = await AuthorizationService.getSingleAuthorizationFromDB(id);
    sendResponse(res, StatusCodes.OK, {
      success: true,
      message: "Authorization retrieved successfully",
      data: result,
    });
  }
);

const updateAuthorization = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;

  if (!id) {
    return sendResponse(res, StatusCodes.BAD_REQUEST, {
      success: false,
      message: "Authorization ID is required",
    });
  }

  // Handle file uploads
  const files = req.files as Express.Multer.File[];
  const imageFiles = files || [];

  // Determine if this is FormData or JSON request
  const contentType = req.headers["content-type"];
  const isFormData = contentType && contentType.includes("multipart/form-data");

  // Prepare authorization data based on request type
  let authorizationData;
  if (isFormData) {
    // For FormData, data is directly in req.body
    authorizationData = {
      image: req.body.image || "",
    };
  } else {
    // For JSON, data is in req.body.body
    authorizationData = req.body.body;
  }

  // File is already uploaded to Cloudinary by multer middleware
  // The path contains the Cloudinary URL
  if (imageFiles.length > 0 && imageFiles[0] && imageFiles[0].path) {
    authorizationData.image = imageFiles[0].path;
  }

  const result = await AuthorizationService.updateAuthorizationIntoDB(
    id,
    authorizationData
  );
  sendResponse(res, StatusCodes.OK, {
    success: true,
    message: "Authorization updated successfully",
    data: result,
  });
});

const deleteAuthorization = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;

  if (!id) {
    return sendResponse(res, StatusCodes.BAD_REQUEST, {
      success: false,
      message: "Authorization ID is required",
    });
  }

  const result = await AuthorizationService.deleteAuthorizationFromDB(id);
  sendResponse(res, StatusCodes.OK, {
    success: true,
    message: "Authorization deleted successfully",
    data: result,
  });
});

export const AuthorizationController = {
  createAuthorization,
  getAllAuthorizations,
  getSingleAuthorization,
  updateAuthorization,
  deleteAuthorization,
};
