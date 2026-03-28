import { z } from "zod";

const zMeals = z.object({
  breakfast: z.boolean().optional().default(false),
  lunch: z.boolean().optional().default(false),
  dinner: z.boolean().optional().default(false),
});

const zBlock = z.object({
  type: z.enum(["TRANSFER", "SIGHTSEEING", "MEAL", "HOTEL", "NOTE"]),
  title: z.string().optional(),
  subtitle: z.string().optional(),
  description: z.string().optional(),
  timeFrom: z.string().optional(),
  timeTo: z.string().optional(),
  meals: zMeals.optional(),
  hotelName: z.string().optional(),
});

const zDay = z.object({
  dayNo: z.number().int().min(1),
  title: z.string().min(2),
  blocks: z.array(zBlock).default([]),
});

const zOffer = z.object({
  isActive: z.coerce.boolean().default(false),
  discountType: z.enum(["flat", "percentage"]),
  flatDiscount: z.coerce.number().nonnegative().optional(),
  discountPercentage: z.coerce.number().min(0).max(100).optional(),
  label: z.string().optional(),
});

const zCreateTourBody = z.object({
  code: z.string().min(3),
  title: z.string().min(3),
  destination: z.string().min(1, "Destination is required"),
  duration: z.union([
    z.object({
      days: z.coerce.number().int().min(1),
      nights: z.coerce.number().int().min(0),
    }),
    z.string().transform((str) => {
      try {
        return JSON.parse(str);
      } catch {
        return { days: 1, nights: 0 };
      }
    }),
  ]),
  category: z
    .string()
    .regex(/^[a-f\d]{24}$/i, "Invalid category ObjectId")
    .min(1, "Category is required"),
  tags: z
    .union([
      z.array(z.string()),
      z.string().transform((str) => {
        try {
          return JSON.parse(str);
        } catch {
          return [];
        }
      }),
    ])
    .optional()
    .default([]),

  highlights: z
    .union([
      z.array(z.string()),
      z.string().transform((str) => {
        try {
          return JSON.parse(str);
        } catch {
          return [];
        }
      }),
    ])
    .default([]),
  inclusion: z
    .union([
      z.array(z.string()),
      z.string().transform((str) => {
        try {
          return JSON.parse(str);
        } catch {
          return [];
        }
      }),
    ])
    .default([]),
  exclusion: z
    .union([
      z.array(z.string()),
      z.string().transform((str) => {
        try {
          return JSON.parse(str);
        } catch {
          return [];
        }
      }),
    ])
    .default([]),
  visaRequirements: z.string().optional(),
  terms: z.string().optional(),
  otherDetails: z.string().optional(),

  coverImageUrl: z.string().url().optional(),
  coverImageId: z.string().optional(),
  galleryUrls: z
    .union([
      z.array(z.string().url()),
      z.string().transform((str) => {
        try {
          return JSON.parse(str);
        } catch {
          return [];
        }
      }),
    ])
    .optional()
    .default([]),
  galleryIds: z
    .union([
      z.array(z.string()),
      z.string().transform((str) => {
        try {
          return JSON.parse(str);
        } catch {
          return [];
        }
      }),
    ])
    .optional()
    .default([]),

  basePrice: z.coerce.number().nonnegative(),
  offer: z
    .union([
      zOffer,
      z.string().transform((str) => {
        try {
          return JSON.parse(str);
        } catch {
          return undefined;
        }
      }),
    ])
    .optional(),

  itinerary: z
    .union([
      z.array(zDay),
      z.string().transform((str) => {
        try {
          return JSON.parse(str);
        } catch {
          return [];
        }
      }),
    ])
    .default([]),

  status: z
    .enum(["DRAFT", "PUBLISHED", "ARCHIVED"])
    .optional()
    .default("DRAFT"),
});

export const zCreateTour = z.object({
  body: zCreateTourBody,
});

export const zUpdateTour = z.object({
  body: zCreateTourBody.partial(),
});

export const zGetTours = z.object({
  // Pagination
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),

  // Sorting
  sortBy: z.string().default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),

  // Search
  search: z.string().optional(),
  searchFields: z.string().optional(), // comma-separated field names

  // Filters
  destination: z
    .string()
    .regex(/^[a-f\d]{24}$/i, "Invalid ObjectId")
    .optional(),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).optional(),
  category: z
    .string()
    .regex(/^[a-f\d]{24}$/i, "Invalid category ObjectId")
    .optional(),
  minPrice: z.coerce.number().nonnegative().optional(),
  maxPrice: z.coerce.number().nonnegative().optional(),
});

export const zCreateDestination = z.object({
  country: z.string().min(2, "Country name is required (min 2 characters)"),
  city: z.string().optional(),
  slug: z.string().min(3, "Slug is required (min 3 characters)"),
});

export const zUpdateDestination = zCreateDestination.partial();
