import { StatusCodes } from "http-status-codes";
import { Types } from "mongoose";
import ApiError from "../../utils/ApiError";
import { checkValidID } from "../../utils/checkValidID";
import { Category, ICategory } from "../../models/category.model";

const findOrCreateCategory = async (
  categoryName: string,
): Promise<Types.ObjectId> => {
  // First, try to find existing category
  let category = await Category.findOne({ name: categoryName });

  if (category) {
    return category._id;
  }

  // If category doesn't exist, create it
  const newCategory = await Category.create({ name: categoryName });
  return newCategory._id;
};

const getAllCategories = async (): Promise<ICategory[]> => {
  const categories = await Category.find().sort({ name: 1 });
  return categories;
};

const createCategory = async (payload: {
  name: string;
}): Promise<ICategory> => {
  // Check if category already exists
  const existingCategory = await Category.findOne({ name: payload.name });
  if (existingCategory) {
    throw new ApiError(StatusCodes.CONFLICT, "Category already exists");
  }

  const result = await Category.create(payload);
  return result;
};

const getSingleCategory = async (id: string): Promise<ICategory | null> => {
  checkValidID(id);
  const result = await Category.findById(id);
  if (!result) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Category not found");
  }
  return result;
};

const updateCategory = async (
  id: string,
  payload: { name: string },
): Promise<ICategory | null> => {
  checkValidID(id);

  // Check if category with new name already exists (excluding current category)
  const existingCategory = await Category.findOne({
    name: payload.name,
    _id: { $ne: id },
  });
  if (existingCategory) {
    throw new ApiError(
      StatusCodes.CONFLICT,
      "Category with this name already exists",
    );
  }

  const result = await Category.findByIdAndUpdate(id, payload, { new: true });
  if (!result) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Category not found");
  }
  return result;
};

const deleteCategory = async (id: string): Promise<ICategory | null> => {
  checkValidID(id);

  // Check if category is being used by any blog
  const { Blog } = await import("../../models/blogs.model");
  const blogsUsingCategory = await Blog.findOne({ category: id });
  if (blogsUsingCategory) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      "Cannot delete category that is being used by blogs",
    );
  }

  const result = await Category.findByIdAndDelete(id);
  if (!result) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Category not found");
  }
  return result;
};

export const CategoryService = {
  findOrCreateCategory,
  getAllCategories,
  createCategory,
  getSingleCategory,
  updateCategory,
  deleteCategory,
};
