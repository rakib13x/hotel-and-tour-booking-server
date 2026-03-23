import { StatusCodes } from "http-status-codes";
import { Blog } from "../../models/blogs.model";
import { Category } from "../../models/category.model";
import ApiError from "../../utils/ApiError";
import { checkValidID } from "../../utils/checkValidID";
import APIFeatures from "../../utils/pagination";
import { IBlog } from "./blogs.interface";
import { CategoryService } from "./category.service";

const createBlogIntoDB = async (payload: any): Promise<IBlog> => {
  // Extract category name from payload
  const { categoryName, ...blogData } = payload;

  if (!categoryName) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Category name is required");
  }

  // Find or create category
  const categoryId = await CategoryService.findOrCreateCategory(categoryName);

  // Create blog with category ID
  const blogPayload = {
    ...blogData,
    category: categoryId,
  };

  const result = await Blog.create(blogPayload);

  if (!result) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Failed to create blog");
  }

  return result;
};

const getAllBlogsFromDB = async (query: Record<string, any>) => {
  console.log(query, "this is for query");

  // Handle searchTerm parameter by mapping it to search
  if (query.searchTerm) {
    query.search = query.searchTerm;
    delete query.searchTerm;
  }

  // Handle category filtering by name instead of ObjectId
  let categoryFilter = {};
  if (query.category) {
    // Find category by name and get its ObjectId
    const category = await Category.findOne({ name: query.category });
    if (category) {
      categoryFilter = { category: category._id };
    } else {
      // If category not found, return empty result
      return {
        data: [],
        pagination: {
          page: 1,
          limit: parseInt(query.limit) || 10,
          total: 0,
          pages: 0,
        },
      };
    }
    // Remove category from query to avoid duplicate filtering
    delete query.category;
  }

  const apiFeatures = new APIFeatures(
    Blog.find().populate("category", "name"),
    query
  );

  // Apply category filter if exists
  if (Object.keys(categoryFilter).length > 0) {
    apiFeatures.query = apiFeatures.query.find(categoryFilter);
  }

  // Search functionality
  apiFeatures.search(["title", "content", "tags"]);

  // Filter functionality
  apiFeatures.filter();

  // Sort functionality
  apiFeatures.sort();

  // Get pagination info
  const paginationInfo = await apiFeatures.pagination();

  // Execute query
  const result = await apiFeatures.query;

  return {
    data: result,
    pagination: {
      page: paginationInfo.currentPage,
      limit: paginationInfo.limit,
      total: paginationInfo.total,
      pages: paginationInfo.totalPages,
    },
  };
};

const getSingleBlogFromDB = async (id: string): Promise<IBlog | null> => {
  checkValidID(id);
  const result = await Blog.findById(id).populate("category", "name");
  if (!result) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Blog not found");
  }
  return result;
};

const updateBlogIntoDB = async (
  id: string,
  payload: any
): Promise<IBlog | null> => {
  checkValidID(id);

  let updateData = { ...payload };

  // If categoryName is provided, find or create category
  if (payload.categoryName) {
    const categoryId = await CategoryService.findOrCreateCategory(
      payload.categoryName
    );
    updateData.category = categoryId;
    delete updateData.categoryName;
  }

  const result = await Blog.findByIdAndUpdate(id, updateData, {
    new: true,
  }).populate("category", "name");

  if (!result) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Blog not found");
  }

  return result;
};

const deleteBlogFromDB = async (id: string): Promise<IBlog | null> => {
  checkValidID(id);
  const result = await Blog.findByIdAndDelete(id);
  if (!result) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Blog not found");
  }
  return result;
};

const getBlogStatsFromDB = async () => {
  const [totalCount, publishedCount, draftCount] = await Promise.all([
    Blog.countDocuments(),
    Blog.countDocuments({ status: "published" }),
    Blog.countDocuments({ status: "draft" }),
  ]);

  return {
    total: totalCount,
    published: publishedCount,
    draft: draftCount,
  };
};

export const BlogService = {
  createBlogIntoDB,
  getAllBlogsFromDB,
  getSingleBlogFromDB,
  updateBlogIntoDB,
  deleteBlogFromDB,
  getBlogStatsFromDB,
};
