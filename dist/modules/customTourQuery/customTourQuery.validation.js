"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.zUpdateCustomTourQuery = exports.zCreateCustomTourQuery = void 0;
const zod_1 = require("zod");
// Create custom tour query validation
const createCustomTourQueryValidation = zod_1.z.object({
    name: zod_1.z
        .string()
        .min(1, { message: "Name is required" })
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
        .max(20, { message: "Phone number cannot exceed 20 characters" })
        .trim(),
    tourId: zod_1.z
        .string()
        .regex(/^[0-9a-fA-F]{24}$/, {
        message: "Invalid tour ID format",
    })
        .optional(),
    tourTitle: zod_1.z
        .string()
        .max(200, {
        message: "Tour title cannot exceed 200 characters",
    })
        .trim()
        .optional(),
});
// Update custom tour query validation
const updateCustomTourQueryValidation = zod_1.z.object({
    name: zod_1.z
        .string()
        .min(1, { message: "Name is required" })
        .max(100, { message: "Name cannot exceed 100 characters" })
        .trim()
        .optional(),
    email: zod_1.z
        .string()
        .min(1, { message: "Email is required" })
        .email({ message: "Please provide a valid email address" })
        .toLowerCase()
        .trim()
        .optional(),
    phone: zod_1.z
        .string()
        .min(1, { message: "Phone number is required" })
        .max(20, { message: "Phone number cannot exceed 20 characters" })
        .trim()
        .optional(),
    status: zod_1.z
        .enum(["pending", "contacted", "closed"], {
        message: "Status must be one of: pending, contacted, closed",
    })
        .optional(),
});
exports.zCreateCustomTourQuery = zod_1.z.object({
    body: createCustomTourQueryValidation,
});
exports.zUpdateCustomTourQuery = zod_1.z.object({
    body: updateCustomTourQueryValidation,
});
//# sourceMappingURL=customTourQuery.validation.js.map