import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { CompanyImagesService } from "./companyImages.service";
import { CompanyImagesValidation } from "./companyImages.validation";

// Helper function to merge existing images with new file paths
const mergeImagesWithFiles = (
  existingImages: any[],
  newFilePaths: string[]
): string[] => {
  const existingImageUrls = Array.isArray(existingImages)
    ? existingImages.filter(
        (item: any) => typeof item === "string" && item.trim() !== ""
      )
    : [];

  return [...existingImageUrls, ...newFilePaths];
};

/**
 * Create a new company images entry
 */
const createCompanyImages = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;

  // Handle file uploads
  if (req.files) {
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };

    // Handle affiliation images
    if (files.affiliation && files.affiliation.length > 0) {
      payload.affiliation = files.affiliation.map((file) => file.path);
    }

    // Handle payment accept images
    if (files.paymentAccept && files.paymentAccept.length > 0) {
      payload.paymentAccept = files.paymentAccept.map((file) => file.path);
    }
  }

  const validatedData =
    CompanyImagesValidation.createCompanyImagesZodSchema.parse({
      body: payload,
    });

  const result = await CompanyImagesService.createCompanyImagesToDB(
    validatedData.body as any
  );

  sendResponse(res, 201, {
    success: true,
    message: "Company images created successfully",
    data: result,
  });
});

/**
 * Get company images by ID
 */
const getCompanyImages = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;

  if (!id) {
    return sendResponse(res, 400, {
      success: false,
      message: "ID is required",
    });
  }

  const result = await CompanyImagesService.getCompanyImagesFromDB(id);

  sendResponse(res, 200, {
    success: true,
    message: "Company images retrieved successfully",
    data: result,
  });
});

/**
 * Get all company images
 */
const getAllCompanyImages = catchAsync(async (req: Request, res: Response) => {
  const result = await CompanyImagesService.getAllCompanyImagesFromDB();

  sendResponse(res, 200, {
    success: true,
    message: "All company images retrieved successfully",
    data: result,
  });
});

/**
 * Update company images by ID
 */
const updateCompanyImages = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const payload = req.body;

  if (!id) {
    return sendResponse(res, 400, {
      success: false,
      message: "ID is required",
    });
  }

  // Handle file uploads and existing file paths
  const files = req.files as { [fieldname: string]: Express.Multer.File[] };

  // Initialize arrays for final image URLs
  let finalAffiliationImages: string[] = [];
  let finalPaymentAcceptImages: string[] = [];

  // Handle affiliation images
  // First, collect existing URLs from form data (these are the ones user wants to keep)
  const existingAffiliationUrls: string[] = [];

  // Check if affiliation is an array (direct from multer)
  if (Array.isArray(payload.affiliation)) {
    payload.affiliation.forEach((url: string) => {
      if (typeof url === "string" && url.trim() !== "") {
        existingAffiliationUrls.push(url);
      }
    });
  } else if (payload.affiliation === "") {
    // If affiliation is empty string, don't update affiliation field
    // This means user didn't modify affiliation images
    // Set a flag to skip affiliation update
    existingAffiliationUrls.push("PRESERVE_EXISTING");
  } else {
    // Fallback: check for affiliation[0], affiliation[1], etc. format
    Object.keys(payload).forEach((key) => {
      if (key.startsWith("affiliation[") && key.endsWith("]")) {
        const url = payload[key];
        if (typeof url === "string" && url.trim() !== "") {
          existingAffiliationUrls.push(url);
        }
      }
    });
  }

  // Add new file paths from uploaded files
  if (files.affiliation && files.affiliation.length > 0) {
    const newFilePaths = files.affiliation.map((file) => file.path);
    finalAffiliationImages = [...existingAffiliationUrls, ...newFilePaths];
  } else {
    finalAffiliationImages = existingAffiliationUrls;
  }

  // Handle payment accept images
  // First, collect existing URLs from form data (these are the ones user wants to keep)
  const existingPaymentAcceptUrls: string[] = [];

  // Check if paymentAccept is an array (direct from multer)
  if (Array.isArray(payload.paymentAccept)) {
    payload.paymentAccept.forEach((url: string) => {
      if (typeof url === "string" && url.trim() !== "") {
        existingPaymentAcceptUrls.push(url);
      }
    });
  } else if (payload.paymentAccept === "") {
    // If paymentAccept is empty string, don't update paymentAccept field
    // This means user didn't modify paymentAccept images
    // Set a flag to skip paymentAccept update
    existingPaymentAcceptUrls.push("PRESERVE_EXISTING");
  } else {
    // Fallback: check for paymentAccept[0], paymentAccept[1], etc. format
    Object.keys(payload).forEach((key) => {
      if (key.startsWith("paymentAccept[") && key.endsWith("]")) {
        const url = payload[key];
        if (typeof url === "string" && url.trim() !== "") {
          existingPaymentAcceptUrls.push(url);
        }
      }
    });
  }

  // Add new file paths from uploaded files
  if (files.paymentAccept && files.paymentAccept.length > 0) {
    const newFilePaths = files.paymentAccept.map((file) => file.path);
    finalPaymentAcceptImages = [...existingPaymentAcceptUrls, ...newFilePaths];
  } else {
    finalPaymentAcceptImages = existingPaymentAcceptUrls;
  }

  // Update payload with final arrays
  // Only update affiliation if it was actually modified
  if (existingAffiliationUrls.includes("PRESERVE_EXISTING")) {
    // Remove the flag and don't update affiliation field
    delete payload.affiliation;
  } else {
    payload.affiliation = finalAffiliationImages;
  }

  // Only update paymentAccept if it was actually modified
  if (existingPaymentAcceptUrls.includes("PRESERVE_EXISTING")) {
    // Remove the flag and don't update paymentAccept field
    delete payload.paymentAccept;
  } else {
    payload.paymentAccept = finalPaymentAcceptImages;
  }

  // Validate the processed data
  const validatedData =
    CompanyImagesValidation.updateCompanyImagesZodSchema.parse({
      body: payload,
    });

  const result = await CompanyImagesService.updateCompanyImagesToDB(
    id,
    validatedData.body as any
  );

  sendResponse(res, 200, {
    success: true,
    message: "Company images updated successfully",
    data: result,
  });
});

/**
 * Delete company images by ID
 */
const deleteCompanyImages = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;

  if (!id) {
    return sendResponse(res, 400, {
      success: false,
      message: "ID is required",
    });
  }

  const result = await CompanyImagesService.deleteCompanyImagesFromDB(id);

  sendResponse(res, 200, {
    success: true,
    message: "Company images deleted successfully",
    data: result,
  });
});

/**
 * Delete specific image from any field (affiliation or paymentAccept)
 */
const deleteSpecificImage = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const fieldType = req.params.fieldType as string;

  if (!id) {
    return sendResponse(res, 400, {
      success: false,
      message: "ID is required",
    });
  }

  if (!fieldType || !["affiliation", "paymentAccept"].includes(fieldType)) {
    return sendResponse(res, 400, {
      success: false,
      message: "Field type must be 'affiliation' or 'paymentAccept'",
    });
  }

  const validatedData = CompanyImagesValidation.deleteImageZodSchema.parse({
    body: req.body,
  });

  const result = await CompanyImagesService.deleteSpecificImageFromDB(
    id,
    fieldType,
    validatedData.body.imageUrl
  );

  sendResponse(res, 200, {
    success: true,
    message: `${fieldType} image deleted successfully`,
    data: result,
  });
});

export const CompanyImagesController = {
  createCompanyImages,
  getCompanyImages,
  getAllCompanyImages,
  updateCompanyImages,
  deleteCompanyImages,
  deleteSpecificImage,
};
