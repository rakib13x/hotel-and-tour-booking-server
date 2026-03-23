import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import logger from "../../config/logger";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { QueryService } from "./query.service";
import ApiError from "../../utils/ApiError";

// Create new query
const createQuery = catchAsync(async (req: Request, res: Response) => {
  const queryData = req.body;

  logger.info("Query form submission received", {
    email: queryData.email,
    name: queryData.name,
    formType: queryData.formType,
  });

  const result = await QueryService.createQuery(queryData);

  sendResponse(res, StatusCodes.CREATED, {
    success: true,
    message: "Query submitted successfully! We'll get back to you soon.",
    data: {
      id: result._id,
      name: result.name,
      email: result.email,
      formType: result.formType,
      status: result.status,
      submittedAt: result.createdAt,
    },
  });
});

// Get all queries with pagination, search, and filtering
const getAllQueries = catchAsync(async (req: Request, res: Response) => {
  const {
    page = "1",
    limit = "10",
    sortBy = "createdAt",
    sortOrder = "desc",
    search,
    formType,
    status,
  } = req.query;

  // Convert string parameters to appropriate types
  const pageNumber = parseInt(page as string, 10);
  const limitNumber = parseInt(limit as string, 10);
  const sortOrderValue =
    (sortOrder as string).toLowerCase() === "asc" ? "asc" : "desc";

  logger.info("Fetching queries with filters", {
    page: pageNumber,
    limit: limitNumber,
    sortBy,
    sortOrder: sortOrderValue,
    search: search || "none",
    formType: formType || "none",
    status: status || "none",
  });

  const result = await QueryService.getAllQueries(
    pageNumber,
    limitNumber,
    sortBy as string,
    sortOrderValue,
    search as string,
    formType as string,
    status as string
  );

  sendResponse(res, StatusCodes.OK, {
    success: true,
    message: "Queries retrieved successfully",
    data: result.queries,
    pagination: {
      page: result.currentPage,
      limit: limitNumber,
      total: result.totalQueries,
      pages: result.totalPages,
    },
  });
});

// Get query by ID
const getQueryById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params as { id: string };

  logger.info("Fetching query by ID", { queryId: id });

  const result = await QueryService.getQueryById(id as string);

  sendResponse(res, StatusCodes.OK, {
    success: true,
    message: "Query retrieved successfully",
    data: result,
  });
});

// Update query by ID
const updateQueryById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params as { id: string };
  const updateData = req.body;

  logger.info("Updating query by ID", { queryId: id, updateData });

  const result = await QueryService.updateQueryById(id as string, updateData);

  sendResponse(res, StatusCodes.OK, {
    success: true,
    message: "Query updated successfully",
    data: result,
  });
});

// Delete query by ID
const deleteQueryById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params as { id: string };

  logger.info("Deleting query by ID", { queryId: id });

  await QueryService.deleteQueryById(id as string);

  sendResponse(res, StatusCodes.OK, {
    success: true,
    message: "Query deleted successfully",
    data: null,
  });
});

// Get query statistics
const getQueryStats = catchAsync(async (req: Request, res: Response) => {
  logger.info("Fetching query statistics");

  const result = await QueryService.getQueryStats();

  sendResponse(res, StatusCodes.OK, {
    success: true,
    message: "Query statistics retrieved successfully",
    data: result,
  });
});

// Get queries by form type
const getQueriesByFormType = catchAsync(async (req: Request, res: Response) => {
  const formType = req.params.formType as string;
  const { page = "1", limit = "10" } = req.query;

  const pageNumber = parseInt(page as string, 10);
  const limitNumber = parseInt(limit as string, 10);

  logger.info("Fetching queries by form type", {
    formType,
    page: pageNumber,
    limit: limitNumber,
  });

  const result = await QueryService.getQueriesByFormType(
    formType,
    pageNumber,
    limitNumber
  );

  sendResponse(res, StatusCodes.OK, {
    success: true,
    message: `Queries for ${formType} retrieved successfully`,
    data: result.queries,
    pagination: {
      page: result.currentPage,
      limit: limitNumber,
      total: result.totalQueries,
      pages: result.totalPages,
    },
  });
});

// Get user's own queries
const getMyQueries = catchAsync(async (req: Request, res: Response) => {
  const userId = (req as any).user?.id;

  logger.info("Fetching user's own queries", { userId });

  if (!userId) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, "User not authenticated");
  }

  const queries = await QueryService.getMyQueries(userId);

  sendResponse(res, StatusCodes.OK, {
    success: true,
    message: "User queries retrieved successfully",
    data: queries,
  });
});

export const QueryController = {
  createQuery,
  getAllQueries,
  getQueryById,
  updateQueryById,
  deleteQueryById,
  getQueryStats,
  getQueriesByFormType,
  getMyQueries,
};
