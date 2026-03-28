"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContactValidation = void 0;
const zod_1 = require("zod");
const createContactValidation = zod_1.z.object({
    body: zod_1.z.object({
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
        message: zod_1.z
            .string()
            .min(1, { message: "Message is required" })
            .max(1000, { message: "Message cannot exceed 1000 characters" })
            .trim(),
    }),
});
const getContactByIdValidation = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z
            .string()
            .min(1, { message: "Contact ID is required" })
            .regex(/^[0-9a-fA-F]{24}$/, { message: "Invalid contact ID format" }),
    }),
});
exports.ContactValidation = {
    createContactValidation,
    getContactByIdValidation,
};
//# sourceMappingURL=contact.validation.js.map