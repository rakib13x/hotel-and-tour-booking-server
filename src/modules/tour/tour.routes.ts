import express, { NextFunction, Request, Response } from "express";
import adminMiddleware from "../../middlewares/adminMiddleware";
import authMiddleware from "../../middlewares/authMiddleware";
import { uploadTourFields } from "../../middlewares/upload";
import validateRequest from "../../middlewares/zodValidation";
import {
  zCreateDestination,
  zCreateTour,
  zUpdateDestination,
  zUpdateTour,
} from "../../validators/tour.zod";
import TourController from "./tour.controller";

const router = express.Router();

// Middleware to parse JSON strings from form-data
const parseFormDataArrays = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Parse JSON strings for arrays (form-data sends arrays as strings)
  if (typeof req.body.tags === "string") {
    try {
      req.body.tags = JSON.parse(req.body.tags);
    } catch (error) {
      // Keep as string for validation
    }
  }
  
  if (typeof req.body.highlights === "string") {
    try {
      req.body.highlights = JSON.parse(req.body.highlights);
    } catch (error) {
      // Keep as string for validation
    }
  }
  
  if (typeof req.body.inclusion === "string") {
    try {
      req.body.inclusion = JSON.parse(req.body.inclusion);
    } catch (error) {
      // Keep as string for validation
    }
  }
  
  if (typeof req.body.exclusion === "string") {
    try {
      req.body.exclusion = JSON.parse(req.body.exclusion);
    } catch (error) {
      // Keep as string for validation
    }
  }
  
  if (typeof req.body.galleryUrls === "string") {
    try {
      req.body.galleryUrls = JSON.parse(req.body.galleryUrls);
    } catch (error) {
      // Keep as string for validation
    }
  }
  
  if (typeof req.body.galleryIds === "string") {
    try {
      req.body.galleryIds = JSON.parse(req.body.galleryIds);
    } catch (error) {
      // Keep as string for validation
    }
  }
  
  if (typeof req.body.seasonalPrices === "string") {
    try {
      req.body.seasonalPrices = JSON.parse(req.body.seasonalPrices);
    } catch (error) {
      // Keep as string for validation
    }
  }
  
  if (typeof req.body.itinerary === "string") {
    try {
      req.body.itinerary = JSON.parse(req.body.itinerary);
    } catch (error) {
      // Keep as string for validation
    }
  }
  
  if (typeof req.body.seo === "string") {
    try {
      req.body.seo = JSON.parse(req.body.seo);
    } catch (error) {
      // Keep as string for validation
    }
  }

  next();
};

// Public routes (no authentication required)
router.get("/", TourController.getTours);
router.get("/offers", TourController.getToursWithOffers);
router.get("/destinations", TourController.getDestinations);
router.get("/country/:countryId", TourController.getToursByCountry);
router.get("/destination/:destinationId", TourController.getToursByDestination);
router.get("/:id", TourController.getTourById);

// Protected routes (authentication required)
router.use(authMiddleware);

// Admin only routes
router.use(adminMiddleware);

// Tour CRUD operations
router.post(
  "/",
  uploadTourFields,
  parseFormDataArrays,
  validateRequest(zCreateTour),
  TourController.createTour
);

router.put(
  "/:id",
  uploadTourFields,
  parseFormDataArrays,
  validateRequest(zUpdateTour),
  TourController.updateTour
);

router.delete("/:id", TourController.deleteTour);

// Destination management routes (admin only)
router.post(
  "/destinations",
  validateRequest(zCreateDestination),
  TourController.createDestination
);
router.put(
  "/destinations/:id",
  validateRequest(zUpdateDestination),
  TourController.updateDestination
);
router.delete("/destinations/:id", TourController.deleteDestination);

export default router;
