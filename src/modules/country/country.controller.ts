import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import APIFeatures from "../../utils/pagination";
import sendResponse from "../../utils/sendResponse";
import CountryService from "./country.service";

class CountryController {
  // Create a new country
  createCountry = catchAsync(async (req: Request, res: Response) => {
    console.log("=== CREATE COUNTRY ===");
    console.log("req.body:", req.body);
    console.log("req.files:", req.files);

    // Handle file uploads - using CloudinaryStorage approach
    if (req.files) {
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };

      // Handle single image
      if (files.image && files.image.length > 0 && files.image[0]) {
        // With CloudinaryStorage, files have a 'path' property containing the Cloudinary URL
        req.body.imageUrl = files.image[0].path;
        console.log("Image uploaded to Cloudinary:", req.body.imageUrl);
      } else {
        console.log("No image found in files.image");
      }
    } else {
      console.log("No files received");
    }

    // Convert isTop from string to boolean (FormData sends as string)
    if (req.body.isTop !== undefined) {
      req.body.isTop = req.body.isTop === "true" || req.body.isTop === true;
      console.log("isTop converted to:", req.body.isTop);
    }

    // Validate required fields
    if (!req.body.imageUrl) {
      console.log("ERROR: Image URL not found after processing");
      return sendResponse(res, 400, {
        success: false,
        message: "Image is required. Please upload an image file.",
      });
    }

    console.log("Final data to save:", req.body);

    const country = await CountryService.createCountry(req.body);
    sendResponse(res, 201, {
      success: true,
      message: "Country created successfully",
      data: country,
    });
  });

  // Get all countries with pagination and filtering
  getCountries = catchAsync(async (req: Request, res: Response) => {
    const options = APIFeatures.extractPaginationOptions(req);

    // Extract isTop filter parameter
    const isTop = req.query.isTop ? String(req.query.isTop) : undefined;
    const queryOptions = {
      ...options,
      ...(isTop !== undefined && { isTop }),
    };

    const result = await CountryService.getCountries(queryOptions);
    sendResponse(res, 200, {
      success: true,
      message: "Countries retrieved successfully",
      data: result.data,
      pagination: result.pagination,
    });
  });

  // Get country by ID
  getCountryById = catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const country = await CountryService.getCountryById(id);
    sendResponse(res, 200, {
      success: true,
      message: "Country retrieved successfully",
      data: country,
    });
  });

  // Update country
  updateCountry = catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id as string;
    console.log("=== UPDATE COUNTRY ===");
    console.log("Country ID:", id);
    console.log("req.body:", req.body);
    console.log("req.files:", req.files);

    // Handle file uploads - using CloudinaryStorage approach
    if (req.files) {
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };

      // Handle single image
      if (files.image && files.image.length > 0 && files.image[0]) {
        // With CloudinaryStorage, files have a 'path' property containing the Cloudinary URL
        req.body.imageUrl = files.image[0].path;
        console.log("New image uploaded to Cloudinary:", req.body.imageUrl);
      }
    }

    // Convert isTop from string to boolean (FormData sends as string)
    if (req.body.isTop !== undefined) {
      req.body.isTop = req.body.isTop === "true" || req.body.isTop === true;
      console.log("isTop converted to:", req.body.isTop);
    }

    console.log("Final data to update:", req.body);

    const country = await CountryService.updateCountry(
      id,
      req.body
    );
    sendResponse(res, 200, {
      success: true,
      message: "Country updated successfully",
      data: country,
    });
  });

  // Delete country
  deleteCountry = catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id as string;
    await CountryService.deleteCountry(id);
    sendResponse(res, 200, {
      success: true,
      message: "Country deleted successfully",
    });
  });

  // Get popular countries
  getPopularCountries = catchAsync(async (req: Request, res: Response) => {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
    const countries = await CountryService.getPopularCountries(limit);
    sendResponse(res, 200, {
      success: true,
      message: "Popular countries retrieved successfully",
      data: countries,
    });
  });

  // Search countries
  searchCountries = catchAsync(async (req: Request, res: Response) => {
    const { q } = req.query;
    if (!q) {
      return sendResponse(res, 400, {
        success: false,
        message: "Search query is required",
      });
    }

    const countries = await CountryService.searchCountries(q as string);
    sendResponse(res, 200, {
      success: true,
      message: "Search results retrieved successfully",
      data: countries,
    });
  });

  // Get top/featured countries
  getTopCountries = catchAsync(async (req: Request, res: Response) => {
    const countries = await CountryService.getTopCountries();
    sendResponse(res, 200, {
      success: true,
      message: "Top countries retrieved successfully",
      data: countries,
    });
  });

  // Get countries with published tours
  getCountriesWithTours = catchAsync(async (req: Request, res: Response) => {
    console.log("=== GET COUNTRIES WITH TOURS ===");
    const countries = await CountryService.getCountriesWithTours();
    console.log(`Found ${countries.length} countries with tours`);
    sendResponse(res, 200, {
      success: true,
      message: "Countries with tours retrieved successfully",
      data: countries,
    });
  });

  // Get countries with active visas
  getCountriesWithVisas = catchAsync(async (req: Request, res: Response) => {
    const countries = await CountryService.getCountriesWithVisas();
    sendResponse(res, 200, {
      success: true,
      message: "Countries with visas retrieved successfully",
      data: countries,
    });
  });
}

export default new CountryController();
