import { Document, Query } from "mongoose";
import { Request } from "express";

export interface PaginationOptions {
  page?: number;
  limit?: number;
  search?: string;
  sort?: string;
  fields?: string;
}

export interface PaginationResult<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
    hasNext?: boolean;
    hasPrev?: boolean;
    next?: number;
    prev?: number;
  };
}

class APIFeatures<T extends Document> {
  public query: Query<T[], T>;
  private queryString: Record<string, any>;

  constructor(query: Query<T[], T>, queryString: Record<string, any>) {
    this.query = query;
    this.queryString = queryString;
  }

  // Helper to extract pagination-related options from Express Request
  static extractPaginationOptions(req: Request): PaginationOptions {
    const page = req.query.page ? parseInt(String(req.query.page)) : undefined;
    const limit = req.query.limit ? parseInt(String(req.query.limit)) : undefined;
    const search = req.query.search ? String(req.query.search) : undefined;
    const sort = req.query.sort ? String(req.query.sort) : undefined;
    const fields = req.query.fields ? String(req.query.fields) : undefined;

    const options: PaginationOptions = {};
    if (page !== undefined) options.page = page;
    if (limit !== undefined) options.limit = limit;
    if (search !== undefined) options.search = search;
    if (sort !== undefined) options.sort = sort;
    if (fields !== undefined) options.fields = fields;

    return options;
  }

  search(searchFields: string[]): this {
    const search = this.queryString.search;
    if (search) {
      const searchRegex = new RegExp(search, "i");
      const searchConditions = searchFields.map(field => ({
        [field]: searchRegex
      }));
      
      this.query = this.query.find({
        $or: searchConditions
      });
    }
    return this;
  }

  filter(): this {
    const queryObj = { ...this.queryString };
    const excludedFields = ["page", "sort", "limit", "fields", "search"];
    excludedFields.forEach(el => delete queryObj[el]);

    // Convert query string to MongoDB operators
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);

    this.query = this.query.find(JSON.parse(queryStr));
    return this;
  }

  sort(): this {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(",").join(" ");
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort("-createdAt");
    }
    return this;
  }

  limitFields(): this {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(",").join(" ");
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select("-__v");
    }
    return this;
  }

  async pagination(): Promise<{
    currentPage: number;
    limit: number;
    totalPages: number;
    total: number;
  }> {
    const page = parseInt(this.queryString.page) || 1;
    const limit = parseInt(this.queryString.limit) || 10;
    const skip = (page - 1) * limit;

    const total = await this.query.model.countDocuments(this.query.getQuery());
    const totalPages = Math.ceil(total / limit);

    this.query = this.query.skip(skip).limit(limit);

    return {
      currentPage: page,
      limit,
      totalPages,
      total,
    };
  }

  // Static method for pagination with population
  static async paginateWithPopulate<T = any>(
    model: { find: any; countDocuments: any },
    filter: any,
    options: PaginationOptions,
    populateField: string
  ): Promise<PaginationResult<T>> {
    const page = options.page || 1;
    const limit = options.limit || 10;
    const skip = (page - 1) * limit;

    // Get total count
    const total = await model.countDocuments(filter);

    // Get paginated data with population
    const data = await model
      .find(filter)
      .populate(populateField)
      .skip(skip)
      .limit(limit)
      .sort(options.sort || '-createdAt');

    const pages = Math.ceil(total / limit);
    const hasNext = page < pages;
    const hasPrev = page > 1;

    const pagination: any = {
      page,
      limit,
      total,
      pages,
    };

    if (hasNext) {
      pagination.hasNext = true;
      pagination.next = page + 1;
    }

    if (hasPrev) {
      pagination.hasPrev = true;
      pagination.prev = page - 1;
    }

    return {
      data,
      pagination,
    };
  }
}

export default APIFeatures;