"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.zUpdateDestination = exports.zCreateDestination = exports.zGetTours = exports.zUpdateTour = exports.zCreateTour = void 0;
const zod_1 = require("zod");
const zMeals = zod_1.z.object({
    breakfast: zod_1.z.boolean().optional().default(false),
    lunch: zod_1.z.boolean().optional().default(false),
    dinner: zod_1.z.boolean().optional().default(false),
});
const zBlock = zod_1.z.object({
    type: zod_1.z.enum(["TRANSFER", "SIGHTSEEING", "MEAL", "HOTEL", "NOTE"]),
    title: zod_1.z.string().optional(),
    subtitle: zod_1.z.string().optional(),
    description: zod_1.z.string().optional(),
    timeFrom: zod_1.z.string().optional(),
    timeTo: zod_1.z.string().optional(),
    meals: zMeals.optional(),
    hotelName: zod_1.z.string().optional(),
});
const zDay = zod_1.z.object({
    dayNo: zod_1.z.number().int().min(1),
    title: zod_1.z.string().min(2),
    blocks: zod_1.z.array(zBlock).default([]),
});
const zOffer = zod_1.z.object({
    isActive: zod_1.z.coerce.boolean().default(false),
    discountType: zod_1.z.enum(["flat", "percentage"]),
    flatDiscount: zod_1.z.coerce.number().nonnegative().optional(),
    discountPercentage: zod_1.z.coerce.number().min(0).max(100).optional(),
    label: zod_1.z.string().optional(),
});
const zCreateTourBody = zod_1.z.object({
    code: zod_1.z.string().min(3),
    title: zod_1.z.string().min(3),
    destination: zod_1.z.string().min(1, "Destination is required"),
    duration: zod_1.z.union([
        zod_1.z.object({
            days: zod_1.z.coerce.number().int().min(1),
            nights: zod_1.z.coerce.number().int().min(0),
        }),
        zod_1.z.string().transform((str) => {
            try {
                return JSON.parse(str);
            }
            catch {
                return { days: 1, nights: 0 };
            }
        }),
    ]),
    category: zod_1.z
        .string()
        .regex(/^[a-f\d]{24}$/i, "Invalid category ObjectId")
        .min(1, "Category is required"),
    tags: zod_1.z
        .union([
        zod_1.z.array(zod_1.z.string()),
        zod_1.z.string().transform((str) => {
            try {
                return JSON.parse(str);
            }
            catch {
                return [];
            }
        }),
    ])
        .optional()
        .default([]),
    highlights: zod_1.z
        .union([
        zod_1.z.array(zod_1.z.string()),
        zod_1.z.string().transform((str) => {
            try {
                return JSON.parse(str);
            }
            catch {
                return [];
            }
        }),
    ])
        .default([]),
    inclusion: zod_1.z
        .union([
        zod_1.z.array(zod_1.z.string()),
        zod_1.z.string().transform((str) => {
            try {
                return JSON.parse(str);
            }
            catch {
                return [];
            }
        }),
    ])
        .default([]),
    exclusion: zod_1.z
        .union([
        zod_1.z.array(zod_1.z.string()),
        zod_1.z.string().transform((str) => {
            try {
                return JSON.parse(str);
            }
            catch {
                return [];
            }
        }),
    ])
        .default([]),
    visaRequirements: zod_1.z.string().optional(),
    terms: zod_1.z.string().optional(),
    otherDetails: zod_1.z.string().optional(),
    coverImageUrl: zod_1.z.string().url().optional(),
    coverImageId: zod_1.z.string().optional(),
    galleryUrls: zod_1.z
        .union([
        zod_1.z.array(zod_1.z.string().url()),
        zod_1.z.string().transform((str) => {
            try {
                return JSON.parse(str);
            }
            catch {
                return [];
            }
        }),
    ])
        .optional()
        .default([]),
    galleryIds: zod_1.z
        .union([
        zod_1.z.array(zod_1.z.string()),
        zod_1.z.string().transform((str) => {
            try {
                return JSON.parse(str);
            }
            catch {
                return [];
            }
        }),
    ])
        .optional()
        .default([]),
    basePrice: zod_1.z.coerce.number().nonnegative(),
    offer: zod_1.z
        .union([
        zOffer,
        zod_1.z.string().transform((str) => {
            try {
                return JSON.parse(str);
            }
            catch {
                return undefined;
            }
        }),
    ])
        .optional(),
    itinerary: zod_1.z
        .union([
        zod_1.z.array(zDay),
        zod_1.z.string().transform((str) => {
            try {
                return JSON.parse(str);
            }
            catch {
                return [];
            }
        }),
    ])
        .default([]),
    status: zod_1.z
        .enum(["DRAFT", "PUBLISHED", "ARCHIVED"])
        .optional()
        .default("DRAFT"),
});
exports.zCreateTour = zod_1.z.object({
    body: zCreateTourBody,
});
exports.zUpdateTour = zod_1.z.object({
    body: zCreateTourBody.partial(),
});
exports.zGetTours = zod_1.z.object({
    // Pagination
    page: zod_1.z.coerce.number().min(1).default(1),
    limit: zod_1.z.coerce.number().min(1).max(100).default(10),
    // Sorting
    sortBy: zod_1.z.string().default("createdAt"),
    sortOrder: zod_1.z.enum(["asc", "desc"]).default("desc"),
    // Search
    search: zod_1.z.string().optional(),
    searchFields: zod_1.z.string().optional(), // comma-separated field names
    // Filters
    destination: zod_1.z
        .string()
        .regex(/^[a-f\d]{24}$/i, "Invalid ObjectId")
        .optional(),
    status: zod_1.z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).optional(),
    category: zod_1.z
        .string()
        .regex(/^[a-f\d]{24}$/i, "Invalid category ObjectId")
        .optional(),
    minPrice: zod_1.z.coerce.number().nonnegative().optional(),
    maxPrice: zod_1.z.coerce.number().nonnegative().optional(),
});
exports.zCreateDestination = zod_1.z.object({
    country: zod_1.z.string().min(2, "Country name is required (min 2 characters)"),
    city: zod_1.z.string().optional(),
    slug: zod_1.z.string().min(3, "Slug is required (min 3 characters)"),
});
exports.zUpdateDestination = exports.zCreateDestination.partial();
//# sourceMappingURL=tour.zod.js.map