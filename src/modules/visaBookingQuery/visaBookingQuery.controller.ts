import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import VisaBookingQueryService from "./visaBookingQuery.service";
import ApiError from "../../utils/ApiError";

class VisaBookingQueryController {
  // Create visa booking query (Public)
  createVisaBookingQuery = catchAsync(async (req: Request, res: Response) => {
    console.log("=== CREATE VISA BOOKING QUERY ===");
    console.log("Request body:", req.body);

    const query = await VisaBookingQueryService.createVisaBookingQuery(
      req.body
    );

    sendResponse(res, 201, {
      success: true,
      message:
        "Your visa application has been submitted successfully! We will contact you soon.",
      data: query,
    });
  });

  // Get all visa booking queries (Admin only)
  getVisaBookingQueries = catchAsync(async (req: Request, res: Response) => {
    const result = await VisaBookingQueryService.getVisaBookingQueries(
      req.query
    );

    sendResponse(res, 200, {
      success: true,
      message: "Visa booking queries retrieved successfully",
      data: result.data,
      pagination: result.pagination,
    });
  });

  // Get visa booking query by ID (Admin only)
  getVisaBookingQueryById = catchAsync(async (req: Request, res: Response) => {
    const query = await VisaBookingQueryService.getVisaBookingQueryById(
      req.params.id as string
    );

    sendResponse(res, 200, {
      success: true,
      message: "Visa booking query retrieved successfully",
      data: query,
    });
  });

  // Update visa booking query status (Admin only)
  updateVisaBookingQueryStatus = catchAsync(
    async (req: Request, res: Response) => {
      const query = await VisaBookingQueryService.updateVisaBookingQueryStatus(
        req.params.id as string,
        req.body
      );

      sendResponse(res, 200, {
        success: true,
        message: "Visa booking query status updated successfully",
        data: query,
      });
    }
  );

  // Delete visa booking query (Admin only)
  deleteVisaBookingQuery = catchAsync(async (req: Request, res: Response) => {
    console.log("=== DELETE VISA BOOKING QUERY ===");
    console.log("Query ID:", req.params.id);
    console.log("User:", req.user);

    await VisaBookingQueryService.deleteVisaBookingQuery(
      req.params.id as string
    );

    console.log("Query deleted successfully");

    sendResponse(res, 200, {
      success: true,
      message: "Visa booking query deleted successfully",
    });
  });

  // Get statistics (Admin only)
  getVisaBookingQueryStats = catchAsync(async (req: Request, res: Response) => {
    const stats = await VisaBookingQueryService.getVisaBookingQueryStats();

    sendResponse(res, 200, {
      success: true,
      message: "Statistics retrieved successfully",
      data: stats,
    });
  });

  // Get user's own visa booking queries (User only)
  getMyVisaBookingQueries = catchAsync(async (req: Request, res: Response) => {
    const userId = (req as any).user?.id;

    if (!userId) {
      throw new ApiError(401, "User not authenticated");
    }

    const queries = await VisaBookingQueryService.getMyVisaBookingQueries(
      userId
    );

    sendResponse(res, 200, {
      success: true,
      message: "User visa booking queries retrieved successfully",
      data: queries,
    });
  });
}

export default new VisaBookingQueryController();
