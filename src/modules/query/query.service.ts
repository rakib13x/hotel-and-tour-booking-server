import httpStatus from "http-status-codes";
import logger from "../../config/logger";
import { IQuery, Query } from "../../models/query.model";
import User from "../auth/auth.model";
import ApiError from "../../utils/ApiError";

// Create new query
const createQuery = async (queryData: IQuery): Promise<IQuery> => {
  try {
    const newQuery = await Query.create(queryData);
    logger.info("Query created successfully", { queryId: newQuery._id });
    return newQuery;
  } catch (error: any) {
    logger.error("Error in createQuery:", error);

    if (error.name === "ValidationError") {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        "Validation failed: " + error.message
      );
    }

    if (error.code === 11000) {
      throw new ApiError(httpStatus.CONFLICT, "Duplicate entry detected");
    }

    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Failed to create query"
    );
  }
};

// Get all queries with pagination, sorting, and filtering
const getAllQueries = async (
  page: number = 1,
  limit: number = 10,
  sortBy: string = "createdAt",
  sortOrder: "asc" | "desc" = "desc",
  search?: string,
  formType?: string,
  status?: string
): Promise<{
  queries: IQuery[];
  totalQueries: number;
  totalPages: number;
  currentPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}> => {
  try {
    // Validate pagination parameters
    const pageNumber = Math.max(1, page);
    const limitNumber = Math.max(1, Math.min(100, limit)); // Max 100 items per page
    const skip = (pageNumber - 1) * limitNumber;

    // Build search query
    let searchQuery: any = {};

    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), "i");
      searchQuery.$or = [
        { name: { $regex: searchRegex } },
        { email: { $regex: searchRegex } },
        { contactNumber: { $regex: searchRegex } },
        { specialRequirements: { $regex: searchRegex } },
        { visitingCountry: { $regex: searchRegex } },
        { visitingCities: { $regex: searchRegex } },
      ];
    }

    // Add form type filter
    if (
      formType &&
      ["hajj_umrah", "package_tour", "group_ticket"].includes(formType)
    ) {
      searchQuery.formType = formType;
    }

    // Add status filter
    if (
      status &&
      ["pending", "reviewed", "contacted", "closed"].includes(status)
    ) {
      searchQuery.status = status;
    }

    // Build sort object
    const sortObject: any = {};
    sortObject[sortBy] = sortOrder === "asc" ? 1 : -1;

    // Execute queries in parallel
    const [queries, totalQueries] = await Promise.all([
      Query.find(searchQuery)
        .sort(sortObject)
        .skip(skip)
        .limit(limitNumber)
        .lean(),
      Query.countDocuments(searchQuery),
    ]);

    // Calculate pagination info
    const totalPages = Math.ceil(totalQueries / limitNumber);
    const hasNextPage = pageNumber < totalPages;
    const hasPrevPage = pageNumber > 1;

    logger.info("Queries retrieved successfully", {
      count: queries.length,
      totalQueries,
      page: pageNumber,
    });

    return {
      queries,
      totalQueries,
      totalPages,
      currentPage: pageNumber,
      hasNextPage,
      hasPrevPage,
    };
  } catch (error: any) {
    logger.error("Error in getAllQueries:", error);
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Failed to retrieve queries"
    );
  }
};

// Get query by ID
const getQueryById = async (queryId: string): Promise<IQuery> => {
  try {
    const query = await Query.findById(queryId).lean();

    if (!query) {
      throw new ApiError(httpStatus.NOT_FOUND, "Query not found");
    }

    logger.info("Query retrieved successfully", { queryId });
    return query;
  } catch (error: any) {
    logger.error("Error in getQueryById:", error);

    if (error.name === "CastError") {
      throw new ApiError(httpStatus.BAD_REQUEST, "Invalid query ID format");
    }

    if (error instanceof ApiError) {
      throw error;
    }

    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Failed to retrieve query"
    );
  }
};

// Update query by ID
const updateQueryById = async (
  queryId: string,
  updateData: Partial<IQuery>
): Promise<IQuery> => {
  try {
    const updatedQuery = await Query.findByIdAndUpdate(queryId, updateData, {
      new: true,
      runValidators: true,
    }).lean();

    if (!updatedQuery) {
      throw new ApiError(httpStatus.NOT_FOUND, "Query not found");
    }

    logger.info("Query updated successfully", { queryId });
    return updatedQuery;
  } catch (error: any) {
    logger.error("Error in updateQueryById:", error);

    if (error.name === "CastError") {
      throw new ApiError(httpStatus.BAD_REQUEST, "Invalid query ID format");
    }

    if (error.name === "ValidationError") {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        "Validation failed: " + error.message
      );
    }

    if (error instanceof ApiError) {
      throw error;
    }

    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Failed to update query"
    );
  }
};

// Delete query by ID
const deleteQueryById = async (queryId: string): Promise<void> => {
  try {
    const deletedQuery = await Query.findByIdAndDelete(queryId);

    if (!deletedQuery) {
      throw new ApiError(httpStatus.NOT_FOUND, "Query not found");
    }

    logger.info("Query deleted successfully", { queryId });
  } catch (error: any) {
    logger.error("Error in deleteQueryById:", error);

    if (error.name === "CastError") {
      throw new ApiError(httpStatus.BAD_REQUEST, "Invalid query ID format");
    }

    if (error instanceof ApiError) {
      throw error;
    }

    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Failed to delete query"
    );
  }
};

// Get query statistics
const getQueryStats = async (): Promise<{
  totalQueries: number;
  todayQueries: number;
  weekQueries: number;
  monthQueries: number;
  pendingQueries: number;
  reviewedQueries: number;
  contactedQueries: number;
  closedQueries: number;
  hajjUmrahQueries: number;
  packageTourQueries: number;
  groupTicketQueries: number;
}> => {
  try {
    const now = new Date();
    const startOfDay = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    );
    const startOfWeek = new Date(startOfDay);
    startOfWeek.setDate(startOfDay.getDate() - startOfDay.getDay());
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [
      totalQueries,
      todayQueries,
      weekQueries,
      monthQueries,
      pendingQueries,
      reviewedQueries,
      contactedQueries,
      closedQueries,
      hajjUmrahQueries,
      packageTourQueries,
      groupTicketQueries,
    ] = await Promise.all([
      Query.countDocuments(),
      Query.countDocuments({ createdAt: { $gte: startOfDay } }),
      Query.countDocuments({ createdAt: { $gte: startOfWeek } }),
      Query.countDocuments({ createdAt: { $gte: startOfMonth } }),
      Query.countDocuments({ status: "pending" }),
      Query.countDocuments({ status: "reviewed" }),
      Query.countDocuments({ status: "contacted" }),
      Query.countDocuments({ status: "closed" }),
      Query.countDocuments({ formType: "hajj_umrah" }),
      Query.countDocuments({ formType: "package_tour" }),
      Query.countDocuments({ formType: "group_ticket" }),
    ]);

    return {
      totalQueries,
      todayQueries,
      weekQueries,
      monthQueries,
      pendingQueries,
      reviewedQueries,
      contactedQueries,
      closedQueries,
      hajjUmrahQueries,
      packageTourQueries,
      groupTicketQueries,
    };
  } catch (error: any) {
    logger.error("Error in getQueryStats:", error);
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Failed to retrieve query statistics"
    );
  }
};

// Get queries by form type
const getQueriesByFormType = async (
  formType: string,
  page: number = 1,
  limit: number = 10
): Promise<{
  queries: IQuery[];
  totalQueries: number;
  totalPages: number;
  currentPage: number;
}> => {
  try {
    const pageNumber = Math.max(1, page);
    const limitNumber = Math.max(1, Math.min(100, limit));
    const skip = (pageNumber - 1) * limitNumber;

    const [queries, totalQueries] = await Promise.all([
      Query.find({ formType })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNumber)
        .lean(),
      Query.countDocuments({ formType }),
    ]);

    const totalPages = Math.ceil(totalQueries / limitNumber);

    logger.info("Queries retrieved by form type successfully", {
      formType,
      count: queries.length,
      totalQueries,
      page: pageNumber,
    });

    return {
      queries,
      totalQueries,
      totalPages,
      currentPage: pageNumber,
    };
  } catch (error: any) {
    logger.error("Error in getQueriesByFormType:", error);
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Failed to retrieve queries by form type"
    );
  }
};

// Get user's own queries
const getMyQueries = async (userId: string): Promise<IQuery[]> => {
  try {
    // Find user to get their email
    const user = await User.findById(userId);

    if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, "User not found");
    }

    const userEmail = user.email.trim().toLowerCase();

    // Find queries by email (case-insensitive)
    const queries = await Query.find({
      email: {
        $regex: `^${userEmail.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`,
        $options: "i",
      },
    })
      .sort({ createdAt: -1 })
      .lean();

    logger.info("User queries retrieved successfully", {
      userId,
      email: userEmail,
      count: queries.length,
    });

    return queries;
  } catch (error: any) {
    logger.error("Error in getMyQueries:", error);

    if (error instanceof ApiError) {
      throw error;
    }

    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Failed to retrieve user queries"
    );
  }
};

export const QueryService = {
  createQuery,
  getAllQueries,
  getQueryById,
  updateQueryById,
  deleteQueryById,
  getQueryStats,
  getQueriesByFormType,
  getMyQueries,
};
