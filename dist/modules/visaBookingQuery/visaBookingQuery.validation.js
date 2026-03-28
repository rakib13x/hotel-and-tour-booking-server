"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.zUpdateVisaBookingQuery = exports.zCreateVisaBookingQuery = void 0;
const zod_1 = require("zod");
// Create visa booking query validation
const createVisaBookingQueryValidation = zod_1.z.object({
    country: zod_1.z
        .string()
        .min(1, { message: "Country is required" })
        .max(100, { message: "Country name cannot exceed 100 characters" })
        .trim(),
    visaType: zod_1.z
        .string()
        .min(1, { message: "Visa type is required" })
        .max(100, { message: "Visa type cannot exceed 100 characters" })
        .trim(),
    name: zod_1.z
        .string()
        .min(1, { message: "Name is required" })
        .min(2, { message: "Name must be at least 2 characters" })
        .max(100, { message: "Name cannot exceed 100 characters" })
        .trim(),
    email: zod_1.z
        .string()
        .min(1, { message: "Email is required" })
        .email({ message: "Please provide a valid email address" })
        .toLowerCase()
        .trim(),
    phone: zod_1.z
        .string()
        .min(1, { message: "Phone number is required" })
        .min(10, { message: "Phone number must be at least 10 digits" })
        .max(20, { message: "Phone number cannot exceed 20 characters" })
        .trim(),
});
// Update visa booking query validation (mainly for status update)
const updateVisaBookingQueryValidation = zod_1.z.object({
    status: zod_1.z.enum(["pending", "contacted", "closed"], {
        message: "Status must be one of: pending, contacted, closed",
    }),
});
exports.zCreateVisaBookingQuery = zod_1.z.object({
    body: createVisaBookingQueryValidation,
});
exports.zUpdateVisaBookingQuery = zod_1.z.object({
    body: updateVisaBookingQueryValidation,
});
//# sourceMappingURL=visaBookingQuery.validation.js.map