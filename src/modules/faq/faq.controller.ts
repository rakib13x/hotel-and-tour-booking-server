import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { FaqService } from "./faq.service";
import { FaqValidation } from "./faq.validation";

const createFaq = catchAsync(async (req: Request, res: Response) => {
  const validatedData = FaqValidation.createFaqZodSchema.parse({
    body: req.body,
  });

  const result = await FaqService.createFaqIntoDB(validatedData.body);

  sendResponse(res, StatusCodes.CREATED, {
    success: true,
    message: "FAQ created successfully",
    data: result,
  });
});

const getAllFaqs = catchAsync(async (req: Request, res: Response) => {
  const result = await FaqService.getAllFaqsFromDB(req.query);

  sendResponse(res, StatusCodes.OK, {
    success: true,
    message: "FAQs retrieved successfully",
    data: result.data,
    pagination: result.pagination,
  });
});

const getSingleFaq = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;

  if (!id) {
    return sendResponse(res, StatusCodes.BAD_REQUEST, {
      success: false,
      message: "FAQ ID is required",
    });
  }

  const result = await FaqService.getSingleFaqFromDB(id);

  sendResponse(res, StatusCodes.OK, {
    success: true,
    message: "FAQ retrieved successfully",
    data: result,
  });
});

const updateFaq = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;

  if (!id) {
    return sendResponse(res, StatusCodes.BAD_REQUEST, {
      success: false,
      message: "FAQ ID is required",
    });
  }

  const validatedData = FaqValidation.updateFaqZodSchema.parse({
    body: req.body,
  });

  const result = await FaqService.updateFaqIntoDB(id, validatedData.body);

  sendResponse(res, StatusCodes.OK, {
    success: true,
    message: "FAQ updated successfully",
    data: result,
  });
});

const deleteFaq = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;

  if (!id) {
    return sendResponse(res, StatusCodes.BAD_REQUEST, {
      success: false,
      message: "FAQ ID is required",
    });
  }

  const result = await FaqService.deleteFaqFromDB(id);

  sendResponse(res, StatusCodes.OK, {
    success: true,
    message: "FAQ deleted successfully",
    data: result,
  });
});

const toggleFaqStatus = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;

  if (!id) {
    return sendResponse(res, StatusCodes.BAD_REQUEST, {
      success: false,
      message: "FAQ ID is required",
    });
  }

  const result = await FaqService.toggleFaqStatusFromDB(id);

  sendResponse(res, StatusCodes.OK, {
    success: true,
    message: `FAQ ${
      result?.isActive ? "activated" : "deactivated"
    } successfully`,
    data: result,
  });
});

const reorderFaqs = catchAsync(async (req: Request, res: Response) => {
  const validatedData = FaqValidation.reorderFaqsZodSchema.parse({
    body: req.body,
  });

  await FaqService.reorderFaqsFromDB(validatedData.body);

  sendResponse(res, StatusCodes.OK, {
    success: true,
    message: "FAQs reordered successfully",
  });
});

const getActiveFaqs = catchAsync(async (req: Request, res: Response) => {
  const result = await FaqService.getActiveFaqsFromDB();

  sendResponse(res, StatusCodes.OK, {
    success: true,
    message: "Active FAQs retrieved successfully",
    data: result,
  });
});

const getFaqStats = catchAsync(async (req: Request, res: Response) => {
  const result = await FaqService.getFaqStatsFromDB();

  sendResponse(res, StatusCodes.OK, {
    success: true,
    message: "FAQ statistics retrieved successfully",
    data: result,
  });
});

export const FaqController = {
  createFaq,
  getAllFaqs,
  getSingleFaq,
  updateFaq,
  deleteFaq,
  toggleFaqStatus,
  reorderFaqs,
  getActiveFaqs,
  getFaqStats,
};
