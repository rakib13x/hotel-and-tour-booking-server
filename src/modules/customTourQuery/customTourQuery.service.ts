import {
  CustomTourQuery,
  ICustomTourQuery,
} from "../../models/customTourQuery.model";
import ApiError from "../../utils/ApiError";
import APIFeatures, { PaginationResult } from "../../utils/pagination";

interface CreateCustomTourQueryInput {
  name: string;
  email: string;
  phone: string;
  tourId?: string;
  tourTitle?: string;
}

interface UpdateCustomTourQueryInput {
  name?: string;
  email?: string;
  phone?: string;
  status?: "pending" | "contacted" | "closed";
}

interface GetCustomTourQueriesOptions {
  page?: number;
  limit?: number;
  search?: string;
  status?: "pending" | "contacted" | "closed";
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

class CustomTourQueryService {
  // Create custom tour query
  async createCustomTourQuery(
    input: CreateCustomTourQueryInput
  ): Promise<ICustomTourQuery> {
    const query = new CustomTourQuery(input);
    await query.save();
    return query;
  }

  // Get all custom tour queries with pagination
  async getCustomTourQueries(
    options: GetCustomTourQueriesOptions
  ): Promise<PaginationResult<ICustomTourQuery>> {
    const {
      page = 1,
      limit = 10,
      search,
      status,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = options;

    const filter: any = {};

    // Status filter
    if (status) {
      filter.status = status;
    }

    // Search filter
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
        { tourTitle: { $regex: search, $options: "i" } },
      ];
    }

    return await APIFeatures.paginateWithPopulate<ICustomTourQuery>(
      CustomTourQuery,
      filter,
      {
        page,
        limit,
        sort: `${sortOrder === "desc" ? "-" : ""}${sortBy}`,
        ...(search && { search }),
      },
      "tourId"
    );
  }

  // Get custom tour query by ID
  async getCustomTourQueryById(id: string): Promise<ICustomTourQuery> {
    const query = await CustomTourQuery.findById(id).populate("tourId");
    if (!query) {
      throw new ApiError(404, "Custom tour query not found");
    }
    return query;
  }

  // Update custom tour query
  async updateCustomTourQuery(
    id: string,
    input: UpdateCustomTourQueryInput
  ): Promise<ICustomTourQuery> {
    const query = await CustomTourQuery.findById(id);
    if (!query) {
      throw new ApiError(404, "Custom tour query not found");
    }

    Object.assign(query, input);
    await query.save();
    return query;
  }

  // Delete custom tour query
  async deleteCustomTourQuery(id: string): Promise<void> {
    const query = await CustomTourQuery.findById(id);
    if (!query) {
      throw new ApiError(404, "Custom tour query not found");
    }
    await CustomTourQuery.findByIdAndDelete(id);
  }

  // Get statistics
  async getCustomTourQueryStats(): Promise<{
    total: number;
    pending: number;
    contacted: number;
    closed: number;
  }> {
    const [stats] = await CustomTourQuery.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          pending: {
            $sum: { $cond: [{ $eq: ["$status", "pending"] }, 1, 0] },
          },
          contacted: {
            $sum: { $cond: [{ $eq: ["$status", "contacted"] }, 1, 0] },
          },
          closed: {
            $sum: { $cond: [{ $eq: ["$status", "closed"] }, 1, 0] },
          },
        },
      },
    ]);

    return stats || { total: 0, pending: 0, contacted: 0, closed: 0 };
  }
}

export default new CustomTourQueryService();
