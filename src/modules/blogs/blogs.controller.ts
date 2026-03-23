import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { uploadImageToCloudinary } from "../../services/cloudinary";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { BlogService } from "./blogs.service";
import { CategoryService } from "./category.service";

const createBlog = catchAsync(async (req: Request, res: Response) => {
  // Handle file uploads
  console.log("=== BLOG CREATION DEBUG ===");
  console.log("Request body:", req.body);
  console.log("Request files:", req.files);
  console.log("Content-Type:", req.headers["content-type"]);
  console.log("Request headers:", req.headers);

  const files = req.files as { [fieldname: string]: Express.Multer.File[] };
  console.log("Files received:", files);
  console.log("Files keys:", Object.keys(files || {}));
  const coverImageFile = files?.coverImage?.[0];
  const blogImageFiles = files?.images || [];

  console.log("Cover image file:", coverImageFile);
  console.log("Cover image file buffer:", coverImageFile?.buffer);
  console.log("Cover image file size:", coverImageFile?.size);
  console.log("Cover image file mimetype:", coverImageFile?.mimetype);
  console.log("Blog image files:", blogImageFiles);

  // Check if cover image is provided
  if (!coverImageFile) {
    return sendResponse(res, StatusCodes.BAD_REQUEST, {
      success: false,
      message: "Cover image is required",
    });
  }

  // Upload cover image to Cloudinary
  if (coverImageFile && coverImageFile.buffer) {
    console.log("Uploading cover image to Cloudinary...");
    const coverImageUrl = await uploadImageToCloudinary(
      coverImageFile.buffer,
      "blogs/cover-images"
    );
    req.body.coverImage = coverImageUrl;
    console.log("Cover image uploaded:", coverImageUrl);
  }

  // Handle blog images
  if (blogImageFiles.length > 0) {
    const blogImageUrls = await Promise.all(
      blogImageFiles.map((file) =>
        uploadImageToCloudinary(file.buffer, "blogs/images")
      )
    );
    req.body.images = blogImageUrls;
  } else {
    req.body.images = [];
  }

  console.log(req.body, "this is req.body after processing");

  const result = await BlogService.createBlogIntoDB(req.body);
  sendResponse(res, StatusCodes.OK, {
    success: true,
    message: "Blog created successfully",
    data: result,
  });
});

const getAllBlogs = catchAsync(async (req: Request, res: Response) => {
  const result = await BlogService.getAllBlogsFromDB(req.query);
  sendResponse(res, StatusCodes.OK, {
    success: true,
    message: "Blogs retrieved successfully",
    data: result.data,
    pagination: result.pagination,
  });
});

const getSingleBlog = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  if (!id) {
    return sendResponse(res, StatusCodes.BAD_REQUEST, {
      success: false,
      message: "Blog ID is required",
    });
  }
  const result = await BlogService.getSingleBlogFromDB(id);
  sendResponse(res, StatusCodes.OK, {
    success: true,
    message: "Blog retrieved successfully",
    data: result,
  });
});

const updateBlog = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;

  if (!id) {
    return sendResponse(res, StatusCodes.BAD_REQUEST, {
      success: false,
      message: "Blog ID is required",
    });
  }

  // Handle file uploads
  const files = req.files as { [fieldname: string]: Express.Multer.File[] };
  const coverImageFile = files?.coverImage?.[0];
  const blogImageFiles = files?.images || [];

  // Upload cover image to Cloudinary if provided
  if (coverImageFile) {
    const coverImageUrl = await uploadImageToCloudinary(
      coverImageFile.buffer,
      "blogs/cover-images"
    );
    req.body.coverImage = coverImageUrl;
  }

  // Upload new blog images to Cloudinary if provided
  if (blogImageFiles.length > 0) {
    const blogImageUrls = await Promise.all(
      blogImageFiles.map((file) =>
        uploadImageToCloudinary(file.buffer, "blogs/images")
      )
    );
    // Append new images to existing ones
    req.body.images = [...(req.body.images || []), ...blogImageUrls];
  }

  const result = await BlogService.updateBlogIntoDB(id, req.body);
  sendResponse(res, StatusCodes.OK, {
    success: true,
    message: "Blog updated successfully",
    data: result,
  });
});

const deleteBlog = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;

  if (!id) {
    return sendResponse(res, StatusCodes.BAD_REQUEST, {
      success: false,
      message: "Blog ID is required",
    });
  }

  const result = await BlogService.deleteBlogFromDB(id);
  sendResponse(res, StatusCodes.OK, {
    success: true,
    message: "Blog deleted successfully",
    data: result,
  });
});


const getBlogStats = catchAsync(async (req: Request, res: Response) => {
  const result = await BlogService.getBlogStatsFromDB();
  sendResponse(res, StatusCodes.OK, {
    success: true,
    message: "Blog statistics retrieved successfully",
    data: result,
  });
});

const getAllCategories = catchAsync(async (req: Request, res: Response) => {
  const result = await CategoryService.getAllCategories();
  sendResponse(res, StatusCodes.OK, {
    success: true,
    message: "Categories retrieved successfully",
    data: result,
  });
});

// Category Management Endpoints
const createCategory = catchAsync(async (req: Request, res: Response) => {
  const result = await CategoryService.createCategory(req.body);
  sendResponse(res, StatusCodes.CREATED, {
    success: true,
    message: "Category created successfully",
    data: result,
  });
});

const getSingleCategory = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  if (!id) {
    return sendResponse(res, StatusCodes.BAD_REQUEST, {
      success: false,
      message: "Category ID is required",
    });
  }
  const result = await CategoryService.getSingleCategory(id);
  sendResponse(res, StatusCodes.OK, {
    success: true,
    message: "Category retrieved successfully",
    data: result,
  });
});

const updateCategory = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  if (!id) {
    return sendResponse(res, StatusCodes.BAD_REQUEST, {
      success: false,
      message: "Category ID is required",
    });
  }
  const result = await CategoryService.updateCategory(id, req.body);
  sendResponse(res, StatusCodes.OK, {
    success: true,
    message: "Category updated successfully",
    data: result,
  });
});

const deleteCategory = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  if (!id) {
    return sendResponse(res, StatusCodes.BAD_REQUEST, {
      success: false,
      message: "Category ID is required",
    });
  }
  const result = await CategoryService.deleteCategory(id);
  sendResponse(res, StatusCodes.OK, {
    success: true,
    message: "Category deleted successfully",
    data: result,
  });
});

export const BlogController = {
  createBlog,
  getAllBlogs,
  getSingleBlog,
  updateBlog,
  deleteBlog,
  getBlogStats,
  getAllCategories,
  createCategory,
  getSingleCategory,
  updateCategory,
  deleteCategory,
};
