import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { GalleryService } from "./gallery.service";

// Category Controllers
const createCategory = catchAsync(async (req: Request, res: Response) => {
  const payload = {
    name: req.body.name,
    image: req.file?.path || req.body.image,
    isActive: req.body.isActive !== undefined ? req.body.isActive : true,
  };

  const result = await GalleryService.createCategoryIntoDB(payload);
  sendResponse(res, StatusCodes.CREATED, {
    success: true,
    message: "Category created successfully",
    data: result,
  });
});

const getAllCategories = catchAsync(async (req: Request, res: Response) => {
  const result = await GalleryService.getAllCategoriesFromDB(req.query);
  sendResponse(res, StatusCodes.OK, {
    success: true,
    message: "Categories retrieved successfully",
    data: result.data,
    pagination: result.pagination,
  });
});

const getActiveCategories = catchAsync(async (req: Request, res: Response) => {
  const result = await GalleryService.getActiveCategoriesFromDB();
  sendResponse(res, StatusCodes.OK, {
    success: true,
    message: "Active categories retrieved successfully",
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
  const result = await GalleryService.getSingleCategoryFromDB(id);
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

  const payload: any = {};
  if (req.body.name) payload.name = req.body.name;
  if (req.body.isActive !== undefined) payload.isActive = req.body.isActive;
  if (req.file?.path) payload.image = req.file.path;

  const result = await GalleryService.updateCategoryIntoDB(id, payload);
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

  const result = await GalleryService.deleteCategoryFromDB(id);
  sendResponse(res, StatusCodes.OK, {
    success: true,
    message: "Category deleted successfully",
    data: result,
  });
});

// SubCategory Controllers
const createSubCategory = catchAsync(async (req: Request, res: Response) => {
  const payload = {
    name: req.body.name,
    categoryId: req.body.categoryId,
    image: req.file?.path || req.body.image,
    isActive: req.body.isActive !== undefined ? req.body.isActive : true,
  };

  const result = await GalleryService.createSubCategoryIntoDB(payload);
  sendResponse(res, StatusCodes.CREATED, {
    success: true,
    message: "SubCategory created successfully",
    data: result,
  });
});

const getAllSubCategories = catchAsync(async (req: Request, res: Response) => {
  const result = await GalleryService.getAllSubCategoriesFromDB(req.query);
  sendResponse(res, StatusCodes.OK, {
    success: true,
    message: "SubCategories retrieved successfully",
    data: result.data,
    pagination: result.pagination,
  });
});

const getSubCategoriesByCategory = catchAsync(
  async (req: Request, res: Response) => {
    const categoryId = req.params.categoryId as string;
    if (!categoryId) {
      return sendResponse(res, StatusCodes.BAD_REQUEST, {
        success: false,
        message: "Category ID is required",
      });
    }
    const result = await GalleryService.getSubCategoriesByCategoryFromDB(
      categoryId
    );
    sendResponse(res, StatusCodes.OK, {
      success: true,
      message: "SubCategories retrieved successfully",
      data: result,
    });
  }
);

const getSingleSubCategory = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  if (!id) {
    return sendResponse(res, StatusCodes.BAD_REQUEST, {
      success: false,
      message: "SubCategory ID is required",
    });
  }
  const result = await GalleryService.getSingleSubCategoryFromDB(id);
  sendResponse(res, StatusCodes.OK, {
    success: true,
    message: "SubCategory retrieved successfully",
    data: result,
  });
});

const updateSubCategory = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;

  if (!id) {
    return sendResponse(res, StatusCodes.BAD_REQUEST, {
      success: false,
      message: "SubCategory ID is required",
    });
  }

  const payload: any = {};
  if (req.body.name) payload.name = req.body.name;
  if (req.body.categoryId) payload.categoryId = req.body.categoryId;
  if (req.body.isActive !== undefined) payload.isActive = req.body.isActive;
  if (req.file?.path) payload.image = req.file.path;

  const result = await GalleryService.updateSubCategoryIntoDB(id, payload);
  sendResponse(res, StatusCodes.OK, {
    success: true,
    message: "SubCategory updated successfully",
    data: result,
  });
});

const deleteSubCategory = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;

  if (!id) {
    return sendResponse(res, StatusCodes.BAD_REQUEST, {
      success: false,
      message: "SubCategory ID is required",
    });
  }

  const result = await GalleryService.deleteSubCategoryFromDB(id);
  sendResponse(res, StatusCodes.OK, {
    success: true,
    message: "SubCategory deleted successfully",
    data: result,
  });
});

// Image Controllers
const createImage = catchAsync(async (req: Request, res: Response) => {
  console.log("=== GALLERY IMAGE CREATE DEBUG ===");
  console.log("Request body:", req.body);
  console.log("Request file:", req.file);
  console.log("Request params:", req.params);
  console.log("Request query:", req.query);
  console.log("=====================================");

  // Check if file was uploaded
  if (!req.file) {
    console.log("ERROR: No file uploaded");
    return sendResponse(res, StatusCodes.BAD_REQUEST, {
      success: false,
      message: "Image file is required",
    });
  }

  // Get image URL from Cloudinary upload
  const imageUrl = req.file.path;
  console.log("Image URL from Cloudinary:", imageUrl);

  // Create image data with URL from uploaded file
  const imageData = {
    ...req.body,
    url: imageUrl,
  };

  console.log("Final image data to save:", imageData);
  console.log("subCategoryId from body:", req.body.subCategoryId);
  console.log("subCategoryId type:", typeof req.body.subCategoryId);

  const result = await GalleryService.createImageIntoDB(imageData);
  console.log("Image created successfully:", result);

  sendResponse(res, StatusCodes.CREATED, {
    success: true,
    message: "Image uploaded and created successfully",
    data: result,
  });
});

const getAllImages = catchAsync(async (req: Request, res: Response) => {
  const result = await GalleryService.getAllImagesFromDB(req.query);
  sendResponse(res, StatusCodes.OK, {
    success: true,
    message: "Images retrieved successfully",
    data: result.data,
    pagination: result.pagination,
  });
});

const getImagesBySubCategory = catchAsync(
  async (req: Request, res: Response) => {
    const subCategoryId = req.params.subCategoryId as string;
    if (!subCategoryId) {
      return sendResponse(res, StatusCodes.BAD_REQUEST, {
        success: false,
        message: "SubCategory ID is required",
      });
    }
    const result = await GalleryService.getImagesBySubCategoryFromDB(
      subCategoryId
    );
    sendResponse(res, StatusCodes.OK, {
      success: true,
      message: "Images retrieved successfully",
      data: result,
    });
  }
);

const getSingleImage = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  if (!id) {
    return sendResponse(res, StatusCodes.BAD_REQUEST, {
      success: false,
      message: "Image ID is required",
    });
  }
  const result = await GalleryService.getSingleImageFromDB(id);
  sendResponse(res, StatusCodes.OK, {
    success: true,
    message: "Image retrieved successfully",
    data: result,
  });
});

const updateImage = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;

  if (!id) {
    return sendResponse(res, StatusCodes.BAD_REQUEST, {
      success: false,
      message: "Image ID is required",
    });
  }

  const result = await GalleryService.updateImageIntoDB(id, req.body);
  sendResponse(res, StatusCodes.OK, {
    success: true,
    message: "Image updated successfully",
    data: result,
  });
});

const deleteImage = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;

  if (!id) {
    return sendResponse(res, StatusCodes.BAD_REQUEST, {
      success: false,
      message: "Image ID is required",
    });
  }

  const result = await GalleryService.deleteImageFromDB(id);
  sendResponse(res, StatusCodes.OK, {
    success: true,
    message: "Image deleted successfully",
    data: result,
  });
});

export const GalleryController = {
  // Category controllers
  createCategory,
  getAllCategories,
  getActiveCategories,
  getSingleCategory,
  updateCategory,
  deleteCategory,

  // SubCategory controllers
  createSubCategory,
  getAllSubCategories,
  getSubCategoriesByCategory,
  getSingleSubCategory,
  updateSubCategory,
  deleteSubCategory,

  // Image controllers
  createImage,
  getAllImages,
  getImagesBySubCategory,
  getSingleImage,
  updateImage,
  deleteImage,
};
