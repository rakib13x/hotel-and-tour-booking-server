"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FaqValidation = exports.reorderFaqsZodSchema = exports.faqIdZodSchema = exports.updateFaqZodSchema = exports.createFaqZodSchema = void 0;
const zod_1 = require("zod");
// FAQ validation schemas
exports.createFaqZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        question: zod_1.z
            .string()
            .min(1, "Question is required")
            .min(5, "Question must be at least 5 characters")
            .max(500, "Question must not exceed 500 characters")
            .trim(),
        answer: zod_1.z
            .string()
            .min(1, "Answer is required")
            .min(10, "Answer must be at least 10 characters")
            .max(2000, "Answer must not exceed 2000 characters")
            .trim(),
        orderIndex: zod_1.z
            .number()
            .int("Order index must be an integer")
            .min(0, "Order index must be non-negative")
            .optional(),
        isActive: zod_1.z.boolean().optional(),
    }),
});
exports.updateFaqZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        question: zod_1.z
            .string()
            .min(1, "Question is required")
            .min(5, "Question must be at least 5 characters")
            .max(500, "Question must not exceed 500 characters")
            .trim()
            .optional(),
        answer: zod_1.z
            .string()
            .min(1, "Answer is required")
            .min(10, "Answer must be at least 10 characters")
            .max(2000, "Answer must not exceed 2000 characters")
            .trim()
            .optional(),
        orderIndex: zod_1.z
            .number()
            .int("Order index must be an integer")
            .min(0, "Order index must be non-negative")
            .optional(),
        isActive: zod_1.z.boolean().optional(),
    }),
});
exports.faqIdZodSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z
            .string()
            .min(1, "FAQ ID is required")
            .regex(/^[0-9a-fA-F]{24}$/, "Invalid FAQ ID format"),
    }),
});
exports.reorderFaqsZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        faqs: zod_1.z
            .array(zod_1.z.object({
            id: zod_1.z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid FAQ ID format"),
            orderIndex: zod_1.z.number().int().min(0),
        }))
            .min(1, "At least one FAQ is required for reordering"),
    }),
});
exports.FaqValidation = {
    createFaqZodSchema: exports.createFaqZodSchema,
    updateFaqZodSchema: exports.updateFaqZodSchema,
    faqIdZodSchema: exports.faqIdZodSchema,
    reorderFaqsZodSchema: exports.reorderFaqsZodSchema,
};
//# sourceMappingURL=faq.validation.js.map