import mongoose, { model, Schema, Types } from "mongoose";

const MealSchema = new Schema(
  {
    breakfast: { type: Boolean, default: false },
    lunch: { type: Boolean, default: false },
    dinner: { type: Boolean, default: false },
  },
  { _id: false }
);

const ItineraryBlock = new Schema(
  {
    type: {
      type: String,
      enum: ["TRANSFER", "SIGHTSEEING", "MEAL", "HOTEL", "NOTE"],
      required: true,
    },
    title: { type: String, trim: true }, // right-side mini label e.g. "Tonle Sap"
    subtitle: { type: String, trim: true }, // e.g. "Pick & Drop", "Meals"
    description: { type: String, trim: true }, // long text/HTML/MD
    meals: { type: MealSchema },
    hotelName: { type: String, trim: true },
    timeFrom: String, // optional "09:00"
    timeTo: String,
  },
  { _id: false }
);

const ItineraryDay = new Schema(
  {
    dayNo: { type: Number, required: true }, // 1,2,3...
    title: { type: String, required: true }, // "Pick up from Airport & Transfer to Hotel"
    blocks: { type: [ItineraryBlock], default: [] },
  },
  { _id: false }
);

export interface ITour {
  _id: Types.ObjectId;
  code: string; // "CAMB001" unique
  title: string; // "Siem Reap (3D/2N)"
  destination: Types.ObjectId; // ref Destination
  duration: { days: number; nights: number };
  category: Types.ObjectId; // ref TourCategory
  tags: string[];

  highlights: string[]; // bullets (left list)
  inclusion: string[];
  exclusion: string[];
  visaRequirements?: string;
  terms?: string;
  otherDetails?: string;

  coverImageUrl?: string; // Cloudinary secure_url
  coverImageId?: string; // Cloudinary public_id (optional)
  galleryUrls: string[]; // array of secure_url
  galleryIds: string[]; // array of public_id (optional)

  basePrice: number;
  bookingFeePercentage: number; // Booking advance percentage (e.g., 20 means 20% of basePrice)

  // Offer fields (optional) - discounted price will be calculated from basePrice
  offer?: {
    isActive: boolean;
    discountType: "flat" | "percentage"; // flat (5000 tk off) or percentage (20% off)
    flatDiscount?: number; // Amount in BDT (e.g., 5000) - used when discountType is "flat"
    discountPercentage?: number; // Percentage value (e.g., 20) - used when discountType is "percentage"
    label?: string; // "Eid Special", "Winter Offer"
  };

  itinerary: (typeof ItineraryDay)[];

  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  publishedAt?: Date;
}

const TourSchema = new Schema<ITour>(
  {
    code: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true, trim: true },
    destination: {
      type: Schema.Types.ObjectId,
      ref: "Country",
      required: true,
    },

    duration: {
      days: { type: Number, required: true, min: 1 },
      nights: { type: Number, required: true, min: 0 },
    },

    category: {
      type: Schema.Types.ObjectId,
      ref: "TourCategory",
      required: true,
    },
    tags: { type: [String], default: [] },

    highlights: { type: [String], default: [] },
    inclusion: { type: [String], default: [] },
    exclusion: { type: [String], default: [] },
    visaRequirements: String,
    terms: String,
    otherDetails: String,

    coverImageUrl: String,
    coverImageId: String,
    galleryUrls: { type: [String], default: [] },
    galleryIds: { type: [String], default: [] },

    basePrice: { type: Number, required: true, min: 0 },
    bookingFeePercentage: {
      type: Number,
      required: true,
      default: 20,
      min: 0,
      max: 100,
    },

    // Offer fields (optional) - discounted price will be calculated from basePrice
    offer: {
      isActive: { type: Boolean, default: false },
      discountType: { type: String, enum: ["flat", "percentage"] },
      flatDiscount: Number, // Amount in BDT (e.g., 5000) - used when discountType is "flat"
      discountPercentage: Number, // Percentage value (e.g., 20) - used when discountType is "percentage"
      label: String, // "Eid Special", "Winter Offer"
    },

    itinerary: { type: [ItineraryDay], default: [] },

    status: {
      type: String,
      enum: ["DRAFT", "PUBLISHED", "ARCHIVED"],
      default: "DRAFT",
      index: true,
    },
    publishedAt: Date,
  },
  { timestamps: true }
);

// Quick text index for search functionality
TourSchema.index({ title: "text", tags: "text", highlights: "text" });

export const Tour =
  (mongoose.models.Tour as mongoose.Model<ITour>) ||
  model<ITour>("Tour", TourSchema);
