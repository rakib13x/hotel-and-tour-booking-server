import { StatusCodes } from "http-status-codes";
import { Category, Image, SubCategory } from "../../models/gallery.model";
import ApiError from "../../utils/ApiError";
import { checkValidID } from "../../utils/checkValidID";
import APIFeatures from "../../utils/pagination";
import { ICategory, IImage, ISubCategory } from "./gallery.interface";

// Category Services
const createCategoryIntoDB = async (payload: {
  name: string;
  image?: string;
  isActive?: boolean;
}): Promise<ICategory> => {
  // Check if category already exists
  const existingCategory = await Category.findOne({
    name: payload.name,
  });

  if (existingCategory) {
    throw new ApiError(StatusCodes.CONFLICT, "Category already exists");
  }

  const result = await Category.create(payload);

  if (!result) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Failed to create category");
  }

  return result;
};

const getAllCategoriesFromDB = async (query: Record<string, any>) => {
  const apiFeatures = new APIFeatures(Category.find(), query);

  // Search functionality
  apiFeatures.search(["name"]);

  // Filter functionality
  apiFeatures.filter();

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

const getActiveCategoriesFromDB = async (): Promise<ICategory[]> => {
  const result = await Category.find({ isActive: true }).sort({ name: 1 });
  return result;
};

const getSingleCategoryFromDB = async (
  id: string
): Promise<ICategory | null> => {
  checkValidID(id);
  const result = await Category.findById(id);
  if (!result) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Category not found");
  }
  return result;
};

const updateCategoryIntoDB = async (
  id: string,
  payload: { name?: string; image?: string; isActive?: boolean }
): Promise<ICategory | null> => {
  checkValidID(id);

  // Check if category name is being updated and if it already exists
  if (payload.name) {
    const existingCategory = await Category.findOne({
      name: payload.name,
      _id: { $ne: id },
    });

    if (existingCategory) {
      throw new ApiError(StatusCodes.CONFLICT, "Category already exists");
    }
  }

  const result = await Category.findByIdAndUpdate(id, payload, {
    new: true,
  });

  if (!result) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Category not found");
  }

  return result;
};

const deleteCategoryFromDB = async (id: string): Promise<ICategory | null> => {
  checkValidID(id);

  // Check if category exists
  const category = await Category.findById(id);
  if (!category) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Category not found");
  }

  // Get all subcategories for this category
  const subCategories = await SubCategory.find({ categoryId: id });

  // Delete all images in subcategories first
  for (const subCategory of subCategories) {
    await Image.deleteMany({ subCategoryId: subCategory._id });
  }

  // Delete all subcategories
  await SubCategory.deleteMany({ categoryId: id });

  // Finally delete the category
  const result = await Category.findByIdAndDelete(id);

  return result;
};

// SubCategory Services
const createSubCategoryIntoDB = async (payload: {
  categoryId: string;
  name: string;
  image?: string;
  isActive?: boolean;
}): Promise<ISubCategory> => {
  // Check if category exists
  const category = await Category.findById(payload.categoryId);
  if (!category) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Category not found");
  }

  // Check if subcategory already exists in this category
  const existingSubCategory = await SubCategory.findOne({
    categoryId: payload.categoryId,
    name: payload.name,
  });

  if (existingSubCategory) {
    throw new ApiError(
      StatusCodes.CONFLICT,
      "SubCategory already exists in this category"
    );
  }

  const result = await SubCategory.create(payload);

  if (!result) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Failed to create subcategory");
  }

  return result;
};

const getAllSubCategoriesFromDB = async (query: Record<string, any>) => {
  const apiFeatures = new APIFeatures(
    SubCategory.find().populate("categoryId"),
    query
  );

  // Search functionality
  apiFeatures.search(["name"]);

  // Filter functionality
  apiFeatures.filter();

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

const getSubCategoriesByCategoryFromDB = async (
  categoryId: string
): Promise<ISubCategory[]> => {
  checkValidID(categoryId);
  const result = await SubCategory.find({ categoryId, isActive: true })
    .populate("categoryId")
    .sort({ name: 1 });
  return result;
};

const getSingleSubCategoryFromDB = async (
  id: string
): Promise<ISubCategory | null> => {
  checkValidID(id);
  const result = await SubCategory.findById(id).populate("categoryId");
  if (!result) {
    throw new ApiError(StatusCodes.NOT_FOUND, "SubCategory not found");
  }
  return result;
};

const updateSubCategoryIntoDB = async (
  id: string,
  payload: {
    categoryId?: string;
    name?: string;
    image?: string;
    isActive?: boolean;
  }
): Promise<ISubCategory | null> => {
  checkValidID(id);

  // Check if category exists (if categoryId is being updated)
  if (payload.categoryId) {
    const category = await Category.findById(payload.categoryId);
    if (!category) {
      throw new ApiError(StatusCodes.NOT_FOUND, "Category not found");
    }
  }

  // Check if subcategory name already exists in the category
  if (payload.name || payload.categoryId) {
    const currentSubCategory = await SubCategory.findById(id);
    const existingSubCategory = await SubCategory.findOne({
      categoryId: payload.categoryId || currentSubCategory?.categoryId,
      name: payload.name || currentSubCategory?.name,
      _id: { $ne: id },
    });

    if (existingSubCategory) {
      throw new ApiError(
        StatusCodes.CONFLICT,
        "SubCategory already exists in this category"
      );
    }
  }

  const result = await SubCategory.findByIdAndUpdate(id, payload, {
    new: true,
  }).populate("categoryId");

  if (!result) {
    throw new ApiError(StatusCodes.NOT_FOUND, "SubCategory not found");
  }

  return result;
};

const deleteSubCategoryFromDB = async (
  id: string
): Promise<ISubCategory | null> => {
  checkValidID(id);

  // Check if subcategory exists
  const subCategory = await SubCategory.findById(id);
  if (!subCategory) {
    throw new ApiError(StatusCodes.NOT_FOUND, "SubCategory not found");
  }

  // Delete all images in this subcategory first
  await Image.deleteMany({ subCategoryId: id });

  // Then delete the subcategory
  const result = await SubCategory.findByIdAndDelete(id);

  return result;
};

// Image Services
const createImageIntoDB = async (payload: {
  subCategoryId: string;
  url: string;
  altText?: string;
  isActive?: boolean;
}): Promise<IImage> => {
  console.log("=== GALLERY SERVICE DEBUG ===");
  console.log("Payload received:", payload);
  console.log("subCategoryId:", payload.subCategoryId);
  console.log("subCategoryId type:", typeof payload.subCategoryId);
  console.log("URL:", payload.url);
  console.log("=============================");

  // Check if subcategory exists
  const subCategory = await SubCategory.findById(payload.subCategoryId);
  console.log("Found subcategory:", subCategory);

  if (!subCategory) {
    console.log("ERROR: SubCategory not found with ID:", payload.subCategoryId);
    throw new ApiError(StatusCodes.NOT_FOUND, "SubCategory not found");
  }

  console.log("Creating image with payload:", payload);
  const result = await Image.create(payload);
  console.log("Image created result:", result);

  if (!result) {
    console.log("ERROR: Failed to create image");
    throw new ApiError(StatusCodes.BAD_REQUEST, "Failed to create image");
  }

  console.log("=== IMAGE CREATED SUCCESSFULLY ===");
  return result;
};

const getAllImagesFromDB = async (query: Record<string, any>) => {
  const apiFeatures = new APIFeatures(
    Image.find().populate("subCategoryId"),
    query
  );

  // Search functionality
  apiFeatures.search(["altText"]);

  // Filter functionality
  apiFeatures.filter();

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

const getImagesBySubCategoryFromDB = async (
  subCategoryId: string
): Promise<IImage[]> => {
  checkValidID(subCategoryId);
  const result = await Image.find({ subCategoryId, isActive: true })
    .populate("subCategoryId")
    .sort({ createdAt: -1 });
  return result;
};

const getSingleImageFromDB = async (id: string): Promise<IImage | null> => {
  checkValidID(id);
  const result = await Image.findById(id).populate("subCategoryId");
  if (!result) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Image not found");
  }
  return result;
};

const updateImageIntoDB = async (
  id: string,
  payload: {
    subCategoryId?: string;
    url?: string;
    altText?: string;
    isActive?: boolean;
  }
): Promise<IImage | null> => {
  checkValidID(id);

  // Check if subcategory exists (if subCategoryId is being updated)
  if (payload.subCategoryId) {
    const subCategory = await SubCategory.findById(payload.subCategoryId);
    if (!subCategory) {
      throw new ApiError(StatusCodes.NOT_FOUND, "SubCategory not found");
    }
  }

  const result = await Image.findByIdAndUpdate(id, payload, {
    new: true,
  }).populate("subCategoryId");

  if (!result) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Image not found");
  }

  return result;
};

const deleteImageFromDB = async (id: string): Promise<IImage | null> => {
  checkValidID(id);
  const result = await Image.findByIdAndDelete(id);
  if (!result) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Image not found");
  }
  return result;
};

export const GalleryService = {
  // Category services
  createCategoryIntoDB,
  getAllCategoriesFromDB,
  getActiveCategoriesFromDB,
  getSingleCategoryFromDB,
  updateCategoryIntoDB,
  deleteCategoryFromDB,

  // SubCategory services
  createSubCategoryIntoDB,
  getAllSubCategoriesFromDB,
  getSubCategoriesByCategoryFromDB,
  getSingleSubCategoryFromDB,
  updateSubCategoryIntoDB,
  deleteSubCategoryFromDB,

  // Image services
  createImageIntoDB,
  getAllImagesFromDB,
  getImagesBySubCategoryFromDB,
  getSingleImageFromDB,
  updateImageIntoDB,
  deleteImageFromDB,
};
