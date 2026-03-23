import { Types } from "mongoose";
import Country from "../../models/Country";
import { Destination, IDestination } from "../../models/destination.model";
import { ITour, Tour } from "../../models/tour.model";
import CloudinaryService from "../../services/cloudinary";
import ApiError from "../../utils/ApiError";
import APIFeatures, {
  PaginationOptions,
  PaginationResult,
} from "../../utils/pagination";

interface CreateTourInput {
  code: string;
  title: string;
  destination: string;
  duration: { days: number; nights: number };
  category: string; // TourCategory ObjectId
  tags?: string[];
  highlights?: string[];
  inclusion?: string[];
  exclusion?: string[];
  visaRequirements?: string;
  terms?: string;
  otherDetails?: string;
  coverImageUrl?: string;
  coverImageId?: string;
  galleryUrls?: string[];
  galleryIds?: string[];
  basePrice: number;
  bookingFeePercentage: number;
  offer?: {
    isActive: boolean;
    discountType: "flat" | "percentage";
    flatDiscount?: number;
    discountPercentage?: number;
    label?: string;
  };
  itinerary?: any[];
  status?: "DRAFT" | "PUBLISHED" | "ARCHIVED";
}

interface UpdateTourInput extends Partial<CreateTourInput> {
  publishedAt?: Date;
}

interface GetToursQuery extends PaginationOptions {
  destination?: string;
  status?: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  category?: string; // TourCategory ObjectId
  minPrice?: number;
  maxPrice?: number;
  search?: string; // Text search for title, code, tags
}

class TourService {
  async createTour(input: CreateTourInput): Promise<ITour> {
    // Check if destination exists
    const destination = await (Country as any).findById(input.destination);

    console.log(input.destination, "this is destination");
    if (!destination) {
      throw new ApiError(400, "Destination not found");
    }

    // Check if code already exists
    const existingTour = await Tour.findOne({ code: input.code });
    if (existingTour) {
      throw new ApiError(400, "Tour code already exists");
    }

    console.log("=== SERVICE - CREATE TOUR - OFFER DEBUG ===");
    console.log("Input data:", JSON.stringify(input, null, 2));
    console.log("Offer data being saved:", input.offer);
    console.log("Offer type:", typeof input.offer);

    const tour = new Tour(input);
    console.log("Tour before save - offer:", tour.offer);

    await tour.save();
    console.log("Tour after save - offer:", tour.offer);
    console.log("Tour saved with ID:", tour._id);

    await tour.populate("destination");
    await tour.populate("category");

    console.log("=== END SERVICE - CREATE TOUR - OFFER DEBUG ===");
    return tour;
  }

  async getTours(query: GetToursQuery): Promise<PaginationResult<ITour>> {
    const { destination, status, category, minPrice, maxPrice, search } = query;

    const filter: any = {};

    // Text search filter (searches in title, code, tags, highlights)
    if (search && search.trim()) {
      filter.$or = [
        { title: { $regex: search.trim(), $options: "i" } }, // case-insensitive search in title
        { code: { $regex: search.trim(), $options: "i" } }, // case-insensitive search in code
        { tags: { $in: [new RegExp(search.trim(), "i")] } }, // search in tags array
        { highlights: { $in: [new RegExp(search.trim(), "i")] } }, // search in highlights array
      ];
    }

    // Destination filter
    if (destination) {
      filter.destination = destination;
    }

    // Status filter
    if (status) {
      filter.status = status;
    }

    // Category filter
    if (category) {
      filter.category = category;
    }

    // Price range filter
    if (minPrice !== undefined || maxPrice !== undefined) {
      filter.basePrice = {};
      if (minPrice !== undefined) filter.basePrice.$gte = minPrice;
      if (maxPrice !== undefined) filter.basePrice.$lte = maxPrice;
    }

    // Use pagination helper with population
    return await APIFeatures.paginateWithPopulate<ITour>(
      Tour,
      filter,
      query,
      "destination category"
    );
  }

  async getTourById(id: string): Promise<ITour> {
    const tour = await Tour.findById(id)
      .populate("destination")
      .populate("category");
    if (!tour) {
      throw new ApiError(404, "Tour not found");
    }

    console.log("Backend - Tour found:", {
      id: tour._id,
      title: tour.title,
      galleryUrls: tour.galleryUrls,
      galleryIds: tour.galleryIds,
      coverImageUrl: tour.coverImageUrl,
    });

    return tour;
  }

  async updateTour(id: string, input: UpdateTourInput): Promise<ITour> {
    console.log("=== UPDATE TOUR SERVICE ===");
    console.log("Updating tour with ID:", id);

    // Convert string ID to ObjectId for reliable querying
    let tour;
    try {
      const objectId = new Types.ObjectId(id);
      tour = await Tour.findById(objectId);
    } catch (error) {
      console.log("Invalid ObjectId format, trying string query");
      tour = await Tour.findById(id);
    }

    if (!tour) {
      console.log("Tour not found with ID:", id);
      throw new ApiError(404, "Tour not found");
    }

    console.log("Tour found:", tour.title);
    console.log(input.destination, "this is input.destination");
    // Check if destination exists (if provided)
    if (input.destination) {
      const destination = await (Country as any).findById(input.destination);
      if (!destination) {
        throw new ApiError(400, "Destination not found");
      }
    }

    // Check if code already exists (if provided)
    if (input.code && input.code !== tour.code) {
      const existingTour = await Tour.findOne({ code: input.code });
      if (existingTour) {
        throw new ApiError(400, "Tour code already exists");
      }
    }

    // Handle image deletion when new images are uploaded
    try {
      // Delete old cover image if new one is provided
      if (input.coverImageUrl && tour.coverImageId) {
        await CloudinaryService.deleteImage(tour.coverImageId);
        console.log("Old cover image deleted");
      }

      // Delete old gallery images if new ones are provided
      if (
        input.galleryUrls &&
        input.galleryUrls.length > 0 &&
        tour.galleryIds &&
        tour.galleryIds.length > 0
      ) {
        await CloudinaryService.deleteMultipleImages(tour.galleryIds);
        console.log("Old gallery images deleted");
      }
    } catch (error) {
      console.error("Error deleting old images from Cloudinary:", error);
      // Continue with update even if image deletion fails
    }

    // Preserve existing images if no new images are provided
    if (!input.coverImageUrl && tour.coverImageUrl) {
      input.coverImageUrl = tour.coverImageUrl;
      if (tour.coverImageId) {
        input.coverImageId = tour.coverImageId;
      }
    }

    if (!input.galleryUrls && tour.galleryUrls && tour.galleryUrls.length > 0) {
      input.galleryUrls = tour.galleryUrls;
      input.galleryIds = tour.galleryIds;
    }

    // Preserve array fields if not provided
    if (!input.tags && tour.tags && tour.tags.length > 0) {
      input.tags = tour.tags;
    }
    if (!input.highlights && tour.highlights && tour.highlights.length > 0) {
      input.highlights = tour.highlights;
    }
    if (!input.inclusion && tour.inclusion && tour.inclusion.length > 0) {
      input.inclusion = tour.inclusion;
    }
    if (!input.exclusion && tour.exclusion && tour.exclusion.length > 0) {
      input.exclusion = tour.exclusion;
    }
    if (!input.itinerary && tour.itinerary && tour.itinerary.length > 0) {
      input.itinerary = tour.itinerary;
    }

    // Selective update - only update fields that are provided
    console.log("Fields to update:", Object.keys(input));

    // Update specific fields safely
    if (input.code !== undefined) tour.code = input.code;
    if (input.title !== undefined) tour.title = input.title;
    if (input.destination !== undefined)
      tour.destination = input.destination as any;
    if (input.duration !== undefined) tour.duration = input.duration;
    if (input.category !== undefined) tour.category = input.category as any;
    if (input.tags !== undefined) tour.tags = input.tags;
    if (input.highlights !== undefined) tour.highlights = input.highlights;
    if (input.inclusion !== undefined) tour.inclusion = input.inclusion;
    if (input.exclusion !== undefined) tour.exclusion = input.exclusion;
    if (input.visaRequirements !== undefined)
      tour.visaRequirements = input.visaRequirements;
    if (input.terms !== undefined) tour.terms = input.terms;
    if (input.otherDetails !== undefined)
      tour.otherDetails = input.otherDetails;
    if (input.coverImageUrl !== undefined)
      tour.coverImageUrl = input.coverImageUrl;
    if (input.coverImageId !== undefined)
      tour.coverImageId = input.coverImageId;
    if (input.galleryUrls !== undefined) tour.galleryUrls = input.galleryUrls;
    if (input.galleryIds !== undefined) tour.galleryIds = input.galleryIds;
    if (input.basePrice !== undefined) tour.basePrice = input.basePrice;
    if (input.bookingFeePercentage !== undefined)
      tour.bookingFeePercentage = input.bookingFeePercentage;
    if (input.offer !== undefined) tour.offer = input.offer;
    if (input.itinerary !== undefined) tour.itinerary = input.itinerary;
    if (input.status !== undefined) tour.status = input.status;
    if ((input as any).publishedAt !== undefined)
      tour.publishedAt = (input as any).publishedAt;

    const savedTour = await tour.save();
    console.log(savedTour, "this is savedTour");
    await tour.populate("destination");
    await tour.populate("category");
    return tour;
  }

  async deleteTour(id: string): Promise<void> {
    const tour = await Tour.findById(id);
    if (!tour) {
      throw new ApiError(404, "Tour not found");
    }

    // Delete images from Cloudinary
    try {
      const imageIdsToDelete: string[] = [];

      if (tour.coverImageId) {
        imageIdsToDelete.push(tour.coverImageId);
      }

      if (tour.galleryIds && tour.galleryIds.length > 0) {
        imageIdsToDelete.push(...tour.galleryIds);
      }

      if (imageIdsToDelete.length > 0) {
        await CloudinaryService.deleteMultipleImages(imageIdsToDelete);
      }
    } catch (error) {
      console.error("Error deleting images from Cloudinary:", error);
      // Continue with tour deletion even if image deletion fails
    }

    await Tour.findByIdAndDelete(id);
  }

  async getRecommendedTours(limit: number = 6): Promise<ITour[]> {
    return await Tour.find({ status: "PUBLISHED" })
      .populate("destination")
      .populate("category")
      .sort({ createdAt: -1 })
      .limit(limit);
  }

  async getToursByDestination(
    destinationId: string,
    limit: number = 10
  ): Promise<ITour[]> {
    return await Tour.find({ destination: destinationId, status: "PUBLISHED" })
      .populate("destination")
      .populate("category")
      .sort({ createdAt: -1 })
      .limit(limit);
  }

  async getToursByCountry(
    countryId: string,
    limit: number = 10
  ): Promise<ITour[]> {
    return await Tour.find({
      destination: countryId,
      status: "PUBLISHED",
    })
      .populate("destination")
      .populate("category")
      .sort({ createdAt: -1 })
      .limit(limit);
  }

  // Get tours with active offers
  async getToursWithOffers(limit: number = 10): Promise<ITour[]> {
    console.log("=== GET TOURS WITH OFFERS ===");

    // First, let's see all tours to debug
    const allTours = await Tour.find({});
    console.log("Total tours in DB:", allTours.length);

    allTours.forEach((tour, index) => {
      console.log(`Tour ${index + 1}:`, {
        title: tour.title,
        status: tour.status,
        hasOffer: !!tour.offer,
        offerIsActive: tour.offer?.isActive,
        offerData: tour.offer,
      });
    });

    // Now get tours with offers
    const toursWithOffers = await Tour.find({
      status: "PUBLISHED",
      "offer.isActive": true,
    })
      .populate("destination")
      .populate("category")
      .sort({ createdAt: -1 })
      .limit(limit);

    console.log("Tours with active offers found:", toursWithOffers.length);

    return toursWithOffers;
  }

  // Destination CRUD operations
  async createDestination(input: {
    country: string;
    city?: string;
    slug: string;
  }): Promise<IDestination> {
    const existingDestination = await Destination.findOne({ slug: input.slug });
    if (existingDestination) {
      throw new ApiError(400, "Destination slug already exists");
    }

    const destination = new Destination(input);
    await destination.save();
    return destination;
  }

  async getDestinations(): Promise<IDestination[]> {
    return await Destination.find().sort({ country: 1, city: 1 });
  }

  async getDestinationById(id: string): Promise<IDestination> {
    const destination = await Destination.findById(id);
    if (!destination) {
      throw new ApiError(404, "Destination not found");
    }
    return destination;
  }

  async updateDestination(
    id: string,
    input: Partial<{ country: string; city?: string; slug: string }>
  ): Promise<IDestination> {
    const destination = await Destination.findById(id);
    if (!destination) {
      throw new ApiError(404, "Destination not found");
    }

    if (input.slug && input.slug !== destination.slug) {
      const existingDestination = await Destination.findOne({
        slug: input.slug,
      });
      if (existingDestination) {
        throw new ApiError(400, "Destination slug already exists");
      }
    }

    Object.assign(destination, input);
    await destination.save();
    return destination;
  }

  async deleteDestination(id: string): Promise<void> {
    const destination = await Destination.findById(id);
    if (!destination) {
      throw new ApiError(404, "Destination not found");
    }

    // Check if any tours are using this destination
    const toursCount = await Tour.countDocuments({ destination: id });
    if (toursCount > 0) {
      throw new ApiError(
        400,
        `Cannot delete destination. ${toursCount} tour(s) are using this destination.`
      );
    }

    await Destination.findByIdAndDelete(id);
  }
}

export default new TourService();
