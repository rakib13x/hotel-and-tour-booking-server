import { Request, Response } from "express";
import CloudinaryService from "../../services/cloudinary";
import catchAsync from "../../utils/catchAsync";
import APIFeatures from "../../utils/pagination";
import TourService from "./tour.service";

class TourController {
  // Tour CRUD operations
  createTour = catchAsync(async (req: Request, res: Response) => {
    try {
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };
      const tourData = { ...req.body };

      // Handle cover image upload (optional)
      if (files.coverImage && files.coverImage.length > 0) {
        const coverImageFile = files.coverImage[0];
        if (coverImageFile) {
          try {
            console.log("Attempting to upload cover image...");
            const coverImageResult = await CloudinaryService.uploadImage(
              coverImageFile,
              { folder: "tours/cover" }
            );
            tourData.coverImageUrl = coverImageResult.secure_url;
            tourData.coverImageId = coverImageResult.public_id;
            console.log(
              "Cover image uploaded successfully:",
              coverImageResult.secure_url
            );
          } catch (error) {
            console.error("Error uploading cover image:", error);
            console.log("Continuing tour creation without cover image...");
            // Don't throw error, just continue without image
          }
        }
      }

      // Handle gallery images upload (optional)
      if (files.galleryImages && files.galleryImages.length > 0) {
        try {
          console.log("Attempting to upload gallery images...");
          const galleryResults = await CloudinaryService.uploadMultipleImages(
            files.galleryImages,
            { folder: "tours/gallery" }
          );
          tourData.galleryUrls = galleryResults.map(
            (result) => result.secure_url
          );
          tourData.galleryIds = galleryResults.map(
            (result) => result.public_id
          );
          console.log(
            "Gallery images uploaded successfully:",
            galleryResults.length,
            "images"
          );
        } catch (error) {
          console.error("Error uploading gallery images:", error);
          console.log("Continuing tour creation without gallery images...");
          // Don't throw error, just continue without images
        }
      }

      // Parse JSON fields that come as strings from FormData
      if (typeof tourData.duration === "string") {
        tourData.duration = JSON.parse(tourData.duration);
      }
      if (typeof tourData.tags === "string") {
        tourData.tags = JSON.parse(tourData.tags);
      }
      if (typeof tourData.highlights === "string") {
        tourData.highlights = JSON.parse(tourData.highlights);
      }
      if (typeof tourData.inclusion === "string") {
        tourData.inclusion = JSON.parse(tourData.inclusion);
      }
      if (typeof tourData.exclusion === "string") {
        tourData.exclusion = JSON.parse(tourData.exclusion);
      }
      if (typeof tourData.itinerary === "string") {
        tourData.itinerary = JSON.parse(tourData.itinerary);
      }
      if (typeof tourData.offer === "string") {
        tourData.offer = JSON.parse(tourData.offer);
      }

      console.log("=== CREATE TOUR - OFFER DATA DEBUG ===");
      console.log("tourData.offer (before parsing):", req.body.offer);
      console.log("tourData.offer (after parsing):", tourData.offer);
      console.log("tourData.offer type:", typeof tourData.offer);

      const tour = await TourService.createTour(tourData);

      res.status(201).json({
        success: true,
        message: "Tour created successfully",
        data: tour,
      });
    } catch (error) {
      throw error;
    }
  });

  getTours = catchAsync(async (req: Request, res: Response) => {
    const options = APIFeatures.extractPaginationOptions(req);

    // Extract filter parameters - only add if they exist
    const filters: any = { ...options };

    if (req.query.search) {
      filters.search = req.query.search as string;
    }
    if (req.query.destination) {
      filters.destination = req.query.destination as string;
    }
    if (req.query.category) {
      filters.category = req.query.category as string;
    }
    if (req.query.status) {
      filters.status = req.query.status as "DRAFT" | "PUBLISHED" | "ARCHIVED";
    }
    if (req.query.minPrice) {
      filters.minPrice = parseInt(req.query.minPrice as string);
    }
    if (req.query.maxPrice) {
      filters.maxPrice = parseInt(req.query.maxPrice as string);
    }

    console.log("=== GET TOURS ===");
    console.log("Query params:", req.query);
    console.log("Filter options:", filters);

    const result = await TourService.getTours(filters);
    console.log("Tours found:", result.data.length);

    res.status(200).json(result);
  });

  getTourById = catchAsync(async (req: Request, res: Response) => {
    const tour = await TourService.getTourById(req.params.id as string);
    res.status(200).json({
      success: true,
      message: "Tour fetched successfully",
      data: tour,
    });
  });

  updateTour = catchAsync(async (req: Request, res: Response) => {
    try {
      console.log("=== UPDATE TOUR CONTROLLER ===");
      console.log("Tour ID from params:", req.params.id);

      const files =
        (req.files as { [fieldname: string]: Express.Multer.File[] }) || {};
      const tourData = { ...req.body };

      // Handle cover image upload
      if (files.coverImage && files.coverImage.length > 0) {
        const coverImageFile = files.coverImage[0];
        if (coverImageFile) {
          try {
            const coverImageResult = await CloudinaryService.uploadImage(
              coverImageFile,
              { folder: "tours/cover" }
            );
            tourData.coverImageUrl = coverImageResult.secure_url;
            tourData.coverImageId = coverImageResult.public_id;
          } catch (error) {
            console.error("Error uploading cover image:", error);
            console.log("Continuing tour update without cover image...");
            // Don't throw error, just continue without image
          }
        }
      }

      // Handle gallery images upload (up to 5 images)
      if (files.galleryImages && files.galleryImages.length > 0) {
        try {
          const galleryResults = await CloudinaryService.uploadMultipleImages(
            files.galleryImages,
            { folder: "tours/gallery" }
          );
          tourData.galleryUrls = galleryResults.map(
            (result) => result.secure_url
          );
          tourData.galleryIds = galleryResults.map(
            (result) => result.public_id
          );
        } catch (error) {
          console.error("Error uploading gallery images:", error);
          console.log("Continuing tour update without gallery images...");
          // Don't throw error, just continue without images
        }
      }

      // Parse JSON fields that come as strings from FormData
      if (typeof tourData.duration === "string") {
        tourData.duration = JSON.parse(tourData.duration);
      }
      if (typeof tourData.tags === "string") {
        tourData.tags = JSON.parse(tourData.tags);
      }
      if (typeof tourData.highlights === "string") {
        tourData.highlights = JSON.parse(tourData.highlights);
      }
      if (typeof tourData.inclusion === "string") {
        tourData.inclusion = JSON.parse(tourData.inclusion);
      }
      if (typeof tourData.exclusion === "string") {
        tourData.exclusion = JSON.parse(tourData.exclusion);
      }
      if (typeof tourData.itinerary === "string") {
        tourData.itinerary = JSON.parse(tourData.itinerary);
      }
      if (typeof tourData.offer === "string") {
        tourData.offer = JSON.parse(tourData.offer);
      }

      console.log("=== CONTROLLER DEBUG ===");
      console.log("req.params:", req.params);
      console.log("req.params.id:", req.params.id);
      console.log("req.url:", req.url);
      console.log("req.method:", req.method);
      console.log("req.route:", req.route);
      console.log("=== OFFER DATA DEBUG ===");
      console.log("tourData.offer (before parsing):", req.body.offer);
      console.log("tourData.offer (after parsing):", tourData.offer);
      console.log("tourData.offer type:", typeof tourData.offer);

      // Extract ID from params or URL as fallback
      let tourId = req.params.id as string;
      if (!tourId) {
        // Fallback: extract ID from URL
        const urlParts = req.url.split("/");
        tourId = urlParts[urlParts.length - 1] as string;
        console.log("Extracted ID from URL:", tourId);
      }

      if (!tourId) {
        return res
          .status(400)
          .json({ success: false, message: "Tour ID is required" });
      }

      const tour = await TourService.updateTour(tourId, tourData);

      res.status(200).json(tour);
    } catch (error) {
      throw error;
    }
  });

  deleteTour = catchAsync(async (req: Request, res: Response) => {
    await TourService.deleteTour(req.params.id as string);
    res
      .status(200)
      .json({ success: true, message: "Tour deleted successfully" });
  });

  getRecommendedTours = catchAsync(async (req: Request, res: Response) => {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 6;
    const tours = await TourService.getRecommendedTours(limit);
    res.status(200).json(tours);
  });

  getToursByDestination = catchAsync(async (req: Request, res: Response) => {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
    const tours = await TourService.getToursByDestination(
      req.params.destinationId as string,
      limit
    );
    res.status(200).json(tours);
  });

  getToursByCountry = catchAsync(async (req: Request, res: Response) => {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
    console.log("=== GET TOURS BY COUNTRY ===");
    console.log("Country ID:", req.params.countryId);
    console.log("Limit:", limit);

    const tours = await TourService.getToursByCountry(
      req.params.countryId as string,
      limit
    );

    console.log("Tours found for this country:", tours.length);
    tours.forEach((tour, index) => {
      const destName =
        typeof tour.destination === "string"
          ? tour.destination
          : (tour.destination as any)?.name || "Unknown";
      console.log(`Tour ${index + 1}:`, {
        title: tour.title,
        destination: destName,
      });
    });

    res.status(200).json(tours);
  });

  getToursWithOffers = catchAsync(async (req: Request, res: Response) => {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
    console.log("=== GET TOURS WITH OFFERS CONTROLLER ===");
    console.log("Requested limit:", limit);

    const tours = await TourService.getToursWithOffers(limit);

    console.log("Sending response with", tours.length, "tours");
    tours.forEach((tour, index) => {
      console.log(`Response Tour ${index + 1}:`, {
        title: tour.title,
        hasOffer: !!tour.offer,
        offerIsActive: tour.offer?.isActive,
      });
    });

    res.status(200).json({
      success: true,
      message: "Tours with offers retrieved successfully",
      data: tours,
    });
  });

  getDestinations = catchAsync(async (req: Request, res: Response) => {
    const destinations = await TourService.getDestinations();
    res.status(200).json(destinations);
  });

  // Destination CRUD operations
  createDestination = catchAsync(async (req: Request, res: Response) => {
    const destination = await TourService.createDestination(req.body);
    res.status(201).json(destination);
  });

  // getDestinations = catchAsync(async (req: Request, res: Response) => {
  //   const destinations = await TourService.getDestinations();
  //   res.status(200).json(destinations);
  // });

  getDestinationById = catchAsync(async (req: Request, res: Response) => {
    const destination = await TourService.getDestinationById(
      req.params.id as string
    );
    res.status(200).json(destination);
  });

  updateDestination = catchAsync(async (req: Request, res: Response) => {
    const destination = await TourService.updateDestination(
      req.params.id as string,
      req.body
    );
    res.status(200).json(destination);
  });

  deleteDestination = catchAsync(async (req: Request, res: Response) => {
    await TourService.deleteDestination(req.params.id as string);
    res
      .status(200)
      .json({ success: true, message: "Destination deleted successfully" });
  });
}

export default new TourController();
