import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { StatusCodes } from "http-status-codes";
import { PolicyPageService } from "./policyPage.service";
import { Request, Response } from "express";

const createPolicyPage = catchAsync(async (req: Request, res: Response) => {
  const result = await PolicyPageService.createPolicyPageIntoDB(req.body);
  sendResponse(res, StatusCodes.CREATED, {
    success: true,
    message: "Policy page created successfully",
    data: result,
  });
});

const getAllPolicyPages = catchAsync(async (req: Request, res: Response) => {
  const result = await PolicyPageService.getAllPolicyPagesFromDB(req.query);
  sendResponse(res, StatusCodes.OK, {
    success: true,
    message: "Policy pages retrieved successfully",
    data: result.data,
    pagination: result.pagination,
  });
});

const getSinglePolicyPage = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  if (!id) {
    return sendResponse(res, StatusCodes.BAD_REQUEST, {
      success: false,
      message: "Policy page ID is required",
    });
  }
  const result = await PolicyPageService.getSinglePolicyPageFromDB(id);
  sendResponse(res, StatusCodes.OK, {
    success: true,
    message: "Policy page retrieved successfully",
    data: result,
  });
});

const getPolicyPageBySlug = catchAsync(async (req: Request, res: Response) => {
  const slug = req.params.slug as string;
  if (!slug) {
    return sendResponse(res, StatusCodes.BAD_REQUEST, {
      success: false,
      message: "Policy page slug is required",
    });
  }
  const result = await PolicyPageService.getPolicyPageBySlugFromDB(slug);
  sendResponse(res, StatusCodes.OK, {
    success: true,
    message: "Policy page retrieved successfully",
    data: result,
  });
});

const updatePolicyPage = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  
  if (!id) {
    return sendResponse(res, StatusCodes.BAD_REQUEST, {
      success: false,
      message: "Policy page ID is required",
    });
  }
  
  const result = await PolicyPageService.updatePolicyPageIntoDB(id, req.body);
  sendResponse(res, StatusCodes.OK, {
    success: true,
    message: "Policy page updated successfully",
    data: result,
  });
});

const deletePolicyPage = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  
  if (!id) {
    return sendResponse(res, StatusCodes.BAD_REQUEST, {
      success: false,
      message: "Policy page ID is required",
    });
  }
  
  const result = await PolicyPageService.deletePolicyPageFromDB(id);
  sendResponse(res, StatusCodes.OK, {
    success: true,
    message: "Policy page deleted successfully",
    data: result,
  });
});

export const PolicyPageController = {
  createPolicyPage,
  getAllPolicyPages,
  getSinglePolicyPage,
  getPolicyPageBySlug,
  updatePolicyPage,
  deletePolicyPage,
};

