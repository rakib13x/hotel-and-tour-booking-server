"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompanyInfoValidation = void 0;
const zod_1 = require("zod");
const socialLinksSchema = zod_1.z.object({
    facebook: zod_1.z.string().url().optional().or(zod_1.z.literal("")),
    twitter: zod_1.z.string().url().optional().or(zod_1.z.literal("")),
    instagram: zod_1.z.string().url().optional().or(zod_1.z.literal("")),
    linkedin: zod_1.z.string().url().optional().or(zod_1.z.literal("")),
    youtube: zod_1.z.string().url().optional().or(zod_1.z.literal("")),
    tiktok: zod_1.z.string().url().optional().or(zod_1.z.literal("")),
});
const createCompanyInfoZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        companyName: zod_1.z.string().min(1, "Company name is required"),
        logo: zod_1.z.string().min(1, "Logo is required"),
        email: zod_1.z
            .array(zod_1.z.string().email({ message: "Invalid email format" }))
            .min(1, "At least one email is required"),
        phone: zod_1.z.array(zod_1.z.string()).min(1, "At least one phone number is required"),
        address: zod_1.z.string().min(1, "Address is required"),
        googleMapUrl: zod_1.z.string().url().optional().or(zod_1.z.literal("")),
        description: zod_1.z.string().optional(),
        socialLinks: socialLinksSchema.optional(),
        youtube_video: zod_1.z.string().url().optional().or(zod_1.z.literal("")),
        yearsOfExperience: zod_1.z
            .number()
            .min(0, "Years of experience must be 0 or greater")
            .max(100, "Years of experience must be less than 100"),
        openingHours: zod_1.z.string().min(1, "Opening hours is required"),
        close: zod_1.z.enum([
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
const updateCompanyInfoZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        companyName: zod_1.z.string().min(1, "Company name is required").optional(),
        logo: zod_1.z.string().optional().or(zod_1.z.literal("")),
        email: zod_1.z
            .array(zod_1.z.string().email({ message: "Invalid email format" }))
            .min(1, "At least one email is required")
            .optional(),
        phone: zod_1.z
            .array(zod_1.z.string())
            .min(1, "At least one phone number is required")
            .optional(),
        address: zod_1.z.string().optional(),
        googleMapUrl: zod_1.z.string().url().optional().or(zod_1.z.literal("")),
        description: zod_1.z.string().optional(),
        socialLinks: socialLinksSchema.optional(),
        youtube_video: zod_1.z.string().url().optional().or(zod_1.z.literal("")),
        yearsOfExperience: zod_1.z
            .number()
            .min(0, "Years of experience must be 0 or greater")
            .max(100, "Years of experience must be less than 100")
            .optional(),
        openingHours: zod_1.z.string().min(1, "Opening hours is required"),
        close: zod_1.z.enum([
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
exports.CompanyInfoValidation = {
    createCompanyInfoZodSchema,
    updateCompanyInfoZodSchema,
};
//# sourceMappingURL=companyInfo.validation.js.map