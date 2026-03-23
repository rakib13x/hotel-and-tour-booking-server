import {
  IVisaBookingQuery,
  VisaBookingQuery,
} from "../../models/visaBookingQuery.model";
import User from "../auth/auth.model";
import ApiError from "../../utils/ApiError";
import APIFeatures, { PaginationResult } from "../../utils/pagination";

interface CreateVisaBookingQueryInput {
  country: string;
  visaType: string;
  type?: "query" | "application";
  name: string;
  email: string;
  phone: string;
}

interface UpdateVisaBookingQueryInput {
  status: "pending" | "contacted" | "closed";
}

interface GetVisaBookingQueriesOptions {
  page?: number;
  limit?: number;
  search?: string;
  status?: "pending" | "contacted" | "closed";
  type?: "query" | "application";
  country?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

class VisaBookingQueryService {
  // Create visa booking query
  async createVisaBookingQuery(
    input: CreateVisaBookingQueryInput
  ): Promise<IVisaBookingQuery> {
    const query = new VisaBookingQuery(input);
    await query.save();
    return query;
  }

  // Get all visa booking queries with pagination
  async getVisaBookingQueries(
    options: GetVisaBookingQueriesOptions
  ): Promise<PaginationResult<IVisaBookingQuery>> {
    const {
      page = 1,
      limit = 10,
      search,
      status,
      type,
      country,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = options;

    const filter: any = {};

    // Status filter
    if (status) {
      filter.status = status;
    }

    // Type filter
    if (type) {
      filter.type = type;
    }

    // Country filter
    if (country) {
      filter.country = { $regex: country, $options: "i" };
    }

    // Search filter
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
        { country: { $regex: search, $options: "i" } },
        { visaType: { $regex: search, $options: "i" } },
      ];
    }

    return await APIFeatures.paginateWithPopulate<IVisaBookingQuery>(
      VisaBookingQuery,
      filter,
      {
        page,
        limit,
        sort: `${sortOrder === "desc" ? "-" : ""}${sortBy}`,
        ...(search && { search }),
      },
      ""
    );
  }

  // Get visa booking query by ID
  async getVisaBookingQueryById(id: string): Promise<IVisaBookingQuery> {
    const query = await VisaBookingQuery.findById(id);
    if (!query) {
      throw new ApiError(404, "Visa booking query not found");
    }
    return query;
  }

  // Update visa booking query status
  async updateVisaBookingQueryStatus(
    id: string,
    input: UpdateVisaBookingQueryInput
  ): Promise<IVisaBookingQuery> {
    const query = await VisaBookingQuery.findById(id);
    if (!query) {
      throw new ApiError(404, "Visa booking query not found");
    }

    query.status = input.status;
    await query.save();
    return query;
  }

  // Delete visa booking query
  async deleteVisaBookingQuery(id: string): Promise<void> {
    console.log("Service: Attempting to delete query with ID:", id);
    const query = await VisaBookingQuery.findById(id);
    if (!query) {
      console.log("Service: Query not found with ID:", id);
      throw new ApiError(404, "Visa booking query not found");
    }
    console.log("Service: Query found, deleting:", query);
    const result = await VisaBookingQuery.findByIdAndDelete(id);
    console.log("Service: Delete result:", result);
  }

  // Get statistics
  async getVisaBookingQueryStats(): Promise<{
    total: number;
    pending: number;
    contacted: number;
    closed: number;
  }> {
    const [stats] = await VisaBookingQuery.aggregate([
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

  // Get user's own visa booking queries
  async getMyVisaBookingQueries(userId: string): Promise<IVisaBookingQuery[]> {
    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(404, "User not found");
    }

    const userEmail = user.email.trim().toLowerCase();

    return await VisaBookingQuery.find({
      email: {
        $regex: `^${userEmail.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`,
        $options: "i",
      },
    }).sort({ createdAt: -1 });
  }
}

export default new VisaBookingQueryService();
