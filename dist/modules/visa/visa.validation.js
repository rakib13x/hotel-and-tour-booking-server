"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CountryVisaValidation = void 0;
const zod_1 = require("zod");
const visaTypeEnum = zod_1.z.enum(["tourist visa", "sticker visa", "e-visa"]);
const createCountryVisaValidation = zod_1.z.object({
    body: zod_1.z.object({
        countryName: zod_1.z
            .string()
            .min(1, "Country name is required")
            .max(100, "Country name must be less than 100 characters")
            .trim(),
        visaTypes: zod_1.z
            .array(visaTypeEnum)
            .min(1, "At least one visa type is required")
            .max(3, "Maximum 3 visa types allowed"),
        processingFee: zod_1.z
            .number()
            .min(0, "Processing fee must be a positive number")
            .optional(),
        required_document: zod_1.z
            .string()
            .min(1, "Required document description is required")
            .max(50000, "Required document description must be less than 50000 characters")
            .trim()
            .optional(),
        isActive: zod_1.z.boolean().optional().default(true),
    }),
});
const updateCountryVisaValidation = zod_1.z.object({
    body: zod_1.z.object({
        countryName: zod_1.z
            .string()
            .min(1, "Country name is required")
            .max(100, "Country name must be less than 100 characters")
            .trim()
            .optional(),
        visaTypes: zod_1.z
            .array(visaTypeEnum)
            .min(1, "At least one visa type is required")
            .max(3, "Maximum 3 visa types allowed")
            .optional(),
        processingFee: zod_1.z
            .number()
            .min(0, "Processing fee must be a positive number")
            .optional(),
        required_document: zod_1.z
            .string()
            .min(1, "Required document description is required")
            .max(50000, "Required document description must be less than 50000 characters")
            .trim()
            .optional(),
        isActive: zod_1.z.boolean().optional(),
    }),
});
const getSingleCountryVisaValidation = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().min(1, "Country visa ID is required"),
    }),
});
const deleteCountryVisaValidation = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().min(1, "Country visa ID is required"),
    }),
});
const getCountryVisaByCountryNameValidation = zod_1.z.object({
    params: zod_1.z.object({
        countryName: zod_1.z.string().min(1, "Country name is required"),
    }),
});
const getCountryVisasByVisaTypeValidation = zod_1.z.object({
    params: zod_1.z.object({
        visaType: visaTypeEnum,
    }),
});
const toggleCountryVisaStatusValidation = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().min(1, "Country visa ID is required"),
    }),
    body: zod_1.z.object({
        isActive: zod_1.z.boolean(),
    }),
});
exports.CountryVisaValidation = {
    createCountryVisaValidation,
    updateCountryVisaValidation,
    getSingleCountryVisaValidation,
    deleteCountryVisaValidation,
    getCountryVisaByCountryNameValidation,
    getCountryVisasByVisaTypeValidation,
    toggleCountryVisaStatusValidation,
};
//# sourceMappingURL=visa.validation.js.map