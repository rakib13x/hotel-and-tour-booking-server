"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cloudinary_1 = __importDefault(require("../../services/cloudinary"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const pagination_1 = __importDefault(require("../../utils/pagination"));
const tour_service_1 = __importDefault(require("./tour.service"));
class TourController {
    constructor() {
        // Tour CRUD operations
        this.createTour = (0, catchAsync_1.default)(async (req, res) => {
            try {
                const files = req.files;
                const tourData = { ...req.body };
                // Handle cover image upload (optional)
                if (files.coverImage && files.coverImage.length > 0) {
                    const coverImageFile = files.coverImage[0];
                    if (coverImageFile) {
                        try {
                            console.log("Attempting to upload cover image...");
                            const coverImageResult = await cloudinary_1.default.uploadImage(coverImageFile, { folder: "tours/cover" });
                            tourData.coverImageUrl = coverImageResult.secure_url;
                            tourData.coverImageId = coverImageResult.public_id;
                            console.log("Cover image uploaded successfully:", coverImageResult.secure_url);
                        }
                        catch (error) {
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
                        const galleryResults = await cloudinary_1.default.uploadMultipleImages(files.galleryImages, { folder: "tours/gallery" });
                        tourData.galleryUrls = galleryResults.map((result) => result.secure_url);
                        tourData.galleryIds = galleryResults.map((result) => result.public_id);
                        console.log("Gallery images uploaded successfully:", galleryResults.length, "images");
                    }
                    catch (error) {
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
                const tour = await tour_service_1.default.createTour(tourData);
                res.status(201).json({
                    success: true,
                    message: "Tour created successfully",
                    data: tour,
                });
            }
            catch (error) {
                throw error;
            }
        });
        this.getTours = (0, catchAsync_1.default)(async (req, res) => {
            const options = pagination_1.default.extractPaginationOptions(req);
            // Extract filter parameters - only add if they exist
            const filters = { ...options };
            if (req.query.search) {
                filters.search = req.query.search;
            }
            if (req.query.destination) {
                filters.destination = req.query.destination;
            }
            if (req.query.category) {
                filters.category = req.query.category;
            }
            if (req.query.status) {
                filters.status = req.query.status;
            }
            if (req.query.minPrice) {
                filters.minPrice = parseInt(req.query.minPrice);
            }
            if (req.query.maxPrice) {
                filters.maxPrice = parseInt(req.query.maxPrice);
            }
            console.log("=== GET TOURS ===");
            console.log("Query params:", req.query);
            console.log("Filter options:", filters);
            const result = await tour_service_1.default.getTours(filters);
            console.log("Tours found:", result.data.length);
            res.status(200).json(result);
        });
        this.getTourById = (0, catchAsync_1.default)(async (req, res) => {
            const tour = await tour_service_1.default.getTourById(req.params.id);
            res.status(200).json({
                success: true,
                message: "Tour fetched successfully",
                data: tour,
            });
        });
        this.updateTour = (0, catchAsync_1.default)(async (req, res) => {
            try {
                console.log("=== UPDATE TOUR CONTROLLER ===");
                console.log("Tour ID from params:", req.params.id);
                const files = req.files || {};
                const tourData = { ...req.body };
                // Handle cover image upload
                if (files.coverImage && files.coverImage.length > 0) {
                    const coverImageFile = files.coverImage[0];
                    if (coverImageFile) {
                        try {
                            const coverImageResult = await cloudinary_1.default.uploadImage(coverImageFile, { folder: "tours/cover" });
                            tourData.coverImageUrl = coverImageResult.secure_url;
                            tourData.coverImageId = coverImageResult.public_id;
                        }
                        catch (error) {
                            console.error("Error uploading cover image:", error);
                            console.log("Continuing tour update without cover image...");
                            // Don't throw error, just continue without image
                        }
                    }
                }
                // Handle gallery images upload (up to 5 images)
                if (files.galleryImages && files.galleryImages.length > 0) {
                    try {
                        const galleryResults = await cloudinary_1.default.uploadMultipleImages(files.galleryImages, { folder: "tours/gallery" });
                        tourData.galleryUrls = galleryResults.map((result) => result.secure_url);
                        tourData.galleryIds = galleryResults.map((result) => result.public_id);
                    }
                    catch (error) {
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
                let tourId = req.params.id;
                if (!tourId) {
                    // Fallback: extract ID from URL
                    const urlParts = req.url.split("/");
                    tourId = urlParts[urlParts.length - 1];
                    console.log("Extracted ID from URL:", tourId);
                }
                if (!tourId) {
                    return res
                        .status(400)
                        .json({ success: false, message: "Tour ID is required" });
                }
                const tour = await tour_service_1.default.updateTour(tourId, tourData);
                res.status(200).json(tour);
            }
            catch (error) {
                throw error;
            }
        });
        this.deleteTour = (0, catchAsync_1.default)(async (req, res) => {
            await tour_service_1.default.deleteTour(req.params.id);
            res
                .status(200)
                .json({ success: true, message: "Tour deleted successfully" });
        });
        this.getRecommendedTours = (0, catchAsync_1.default)(async (req, res) => {
            const limit = req.query.limit ? parseInt(req.query.limit) : 6;
            const tours = await tour_service_1.default.getRecommendedTours(limit);
            res.status(200).json(tours);
        });
        this.getToursByDestination = (0, catchAsync_1.default)(async (req, res) => {
            const limit = req.query.limit ? parseInt(req.query.limit) : 10;
            const tours = await tour_service_1.default.getToursByDestination(req.params.destinationId, limit);
            res.status(200).json(tours);
        });
        this.getToursByCountry = (0, catchAsync_1.default)(async (req, res) => {
            const limit = req.query.limit ? parseInt(req.query.limit) : 10;
            console.log("=== GET TOURS BY COUNTRY ===");
            console.log("Country ID:", req.params.countryId);
            console.log("Limit:", limit);
            const tours = await tour_service_1.default.getToursByCountry(req.params.countryId, limit);
            console.log("Tours found for this country:", tours.length);
            tours.forEach((tour, index) => {
                const destName = typeof tour.destination === "string"
                    ? tour.destination
                    : tour.destination?.name || "Unknown";
                console.log(`Tour ${index + 1}:`, {
                    title: tour.title,
                    destination: destName,
                });
            });
            res.status(200).json(tours);
        });
        this.getToursWithOffers = (0, catchAsync_1.default)(async (req, res) => {
            const limit = req.query.limit ? parseInt(req.query.limit) : 10;
            console.log("=== GET TOURS WITH OFFERS CONTROLLER ===");
            console.log("Requested limit:", limit);
            const tours = await tour_service_1.default.getToursWithOffers(limit);
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
        this.getDestinations = (0, catchAsync_1.default)(async (req, res) => {
            const destinations = await tour_service_1.default.getDestinations();
            res.status(200).json(destinations);
        });
        // Destination CRUD operations
        this.createDestination = (0, catchAsync_1.default)(async (req, res) => {
            const destination = await tour_service_1.default.createDestination(req.body);
            res.status(201).json(destination);
        });
        // getDestinations = catchAsync(async (req: Request, res: Response) => {
        //   const destinations = await TourService.getDestinations();
        //   res.status(200).json(destinations);
        // });
        this.getDestinationById = (0, catchAsync_1.default)(async (req, res) => {
            const destination = await tour_service_1.default.getDestinationById(req.params.id);
            res.status(200).json(destination);
        });
        this.updateDestination = (0, catchAsync_1.default)(async (req, res) => {
            const destination = await tour_service_1.default.updateDestination(req.params.id, req.body);
            res.status(200).json(destination);
        });
        this.deleteDestination = (0, catchAsync_1.default)(async (req, res) => {
            await tour_service_1.default.deleteDestination(req.params.id);
            res
                .status(200)
                .json({ success: true, message: "Destination deleted successfully" });
        });
    }
}
exports.default = new TourController();
//# sourceMappingURL=tour.controller.js.map