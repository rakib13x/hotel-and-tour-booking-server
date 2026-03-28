import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import CustomTourQueryService from "./customTourQuery.service";

class CustomTourQueryController {
  // Create custom tour query (Public)
  createCustomTourQuery = catchAsync(async (req: Request, res: Response) => {
    console.log("=== CREATE CUSTOM TOUR QUERY ===");
    console.log("Request body:", req.body);

    const query = await CustomTourQueryService.createCustomTourQuery(req.body);

    sendResponse(res, 201, {
      success: true,
      message:
        "Your query has been submitted successfully! We will contact you soon.",
      data: query,
    });
  });

  // Get all custom tour queries (Admin only)
  getCustomTourQueries = catchAsync(async (req: Request, res: Response) => {
    const result = await CustomTourQueryService.getCustomTourQueries(req.query);

    sendResponse(res, 200, {
      success: true,
      message: "Custom tour queries retrieved successfully",
      data: result.data,
      pagination: result.pagination,
    });
  });

  // Get custom tour query by ID (Admin only)
  getCustomTourQueryById = catchAsync(async (req: Request, res: Response) => {
    const query = await CustomTourQueryService.getCustomTourQueryById(
      req.params.id as string
    );

    sendResponse(res, 200, {
      success: true,
      message: "Custom tour query retrieved successfully",
      data: query,
    });
  });

  // Update custom tour query (Admin only)
  updateCustomTourQuery = catchAsync(async (req: Request, res: Response) => {
    const query = await CustomTourQueryService.updateCustomTourQuery(
      req.params.id as string,
      req.body
    );

    sendResponse(res, 200, {
      success: true,
      message: "Custom tour query updated successfully",
      data: query,
    });
  });

  // Delete custom tour query (Admin only)
  deleteCustomTourQuery = catchAsync(async (req: Request, res: Response) => {
    await CustomTourQueryService.deleteCustomTourQuery(req.params.id as string);

    sendResponse(res, 200, {
      success: true,
      message: "Custom tour query deleted successfully",
    });
  });

  // Get statistics (Admin only)
  getCustomTourQueryStats = catchAsync(async (req: Request, res: Response) => {
    const stats = await CustomTourQueryService.getCustomTourQueryStats();

    sendResponse(res, 200, {
      success: true,
      message: "Statistics retrieved successfully",
      data: stats,
    });
  });
}

export default new CustomTourQueryController();
