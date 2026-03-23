import { z } from "zod";

const socialLinksSchema = z.object({
  facebook: z.string().url().optional().or(z.literal("")),
  twitter: z.string().url().optional().or(z.literal("")),
  instagram: z.string().url().optional().or(z.literal("")),
  linkedin: z.string().url().optional().or(z.literal("")),
  youtube: z.string().url().optional().or(z.literal("")),
  tiktok: z.string().url().optional().or(z.literal("")),
});

const createCompanyInfoZodSchema = z.object({
  body: z.object({
    companyName: z.string().min(1, "Company name is required"),
    logo: z.string().min(1, "Logo is required"),
    email: z
      .array(z.string().email({ message: "Invalid email format" }))
      .min(1, "At least one email is required"),
    phone: z.array(z.string()).min(1, "At least one phone number is required"),
    address: z.string().min(1, "Address is required"),
    googleMapUrl: z.string().url().optional().or(z.literal("")),
    description: z.string().optional(),
    socialLinks: socialLinksSchema.optional(),
    youtube_video: z.string().url().optional().or(z.literal("")),
    yearsOfExperience: z
      .number()
      .min(0, "Years of experience must be 0 or greater")
      .max(100, "Years of experience must be less than 100"),
    openingHours: z.string().min(1, "Opening hours is required"),
    close: z.enum([
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ]),
  }),
});

const updateCompanyInfoZodSchema = z.object({
  body: z.object({
    companyName: z.string().min(1, "Company name is required").optional(),
    logo: z.string().optional().or(z.literal("")),
    email: z
      .array(z.string().email({ message: "Invalid email format" }))
      .min(1, "At least one email is required")
      .optional(),
    phone: z
      .array(z.string())
      .min(1, "At least one phone number is required")
      .optional(),
    address: z.string().optional(),
    googleMapUrl: z.string().url().optional().or(z.literal("")),
    description: z.string().optional(),
    socialLinks: socialLinksSchema.optional(),
    youtube_video: z.string().url().optional().or(z.literal("")),
    yearsOfExperience: z
      .number()
      .min(0, "Years of experience must be 0 or greater")
      .max(100, "Years of experience must be less than 100")
      .optional(),
    openingHours: z.string().min(1, "Opening hours is required"),
    close: z.enum([
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ]),
  }),
});

export const CompanyInfoValidation = {
  createCompanyInfoZodSchema,
  updateCompanyInfoZodSchema,
};
