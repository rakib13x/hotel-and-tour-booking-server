"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tour = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const MealSchema = new mongoose_1.Schema({
    breakfast: { type: Boolean, default: false },
    lunch: { type: Boolean, default: false },
    dinner: { type: Boolean, default: false },
}, { _id: false });
const ItineraryBlock = new mongoose_1.Schema({
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
}, { _id: false });
const ItineraryDay = new mongoose_1.Schema({
    dayNo: { type: Number, required: true }, // 1,2,3...
    title: { type: String, required: true }, // "Pick up from Airport & Transfer to Hotel"
    blocks: { type: [ItineraryBlock], default: [] },
}, { _id: false });
const TourSchema = new mongoose_1.Schema({
    code: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true, trim: true },
    destination: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Country",
        required: true,
    },
    duration: {
        days: { type: Number, required: true, min: 1 },
        nights: { type: Number, required: true, min: 0 },
    },
    category: {
        type: mongoose_1.Schema.Types.ObjectId,
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
}, { timestamps: true });
// Quick text index for search functionality
TourSchema.index({ title: "text", tags: "text", highlights: "text" });
exports.Tour = mongoose_1.default.models.Tour ||
    (0, mongoose_1.model)("Tour", TourSchema);
//# sourceMappingURL=tour.model.js.map