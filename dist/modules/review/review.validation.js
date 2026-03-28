"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewValidation = void 0;
const zod_1 = require("zod");
// We validate the full request structure to match project's zodValidation middleware
const createReviewSchema = zod_1.z.object({
    params: zod_1.z.object({}).optional(),
    query: zod_1.z.object({}).optional(),
    body: zod_1.z.object({
        userName: zod_1.z.string({ message: "User name is required" }).min(1),
        userProfileImg: zod_1.z.string().optional(),
        designation: zod_1.z.string().optional().default("Traveller"),
        rating: zod_1.z.coerce
            .number({ message: "Rating must be a valid number" })
            .min(1)
            .max(5),
        comment: zod_1.z.string({ message: "Comment is required" }).min(1),
    }),
});
const updateReviewSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z
            .string()
            .min(1, { message: "ID is required" })
            .regex(/^[0-9a-fA-F]{24}$/, { message: "Invalid ID format" }),
    }),
    query: zod_1.z.object({}).optional(),
    body: zod_1.z.object({
        userName: zod_1.z.string().optional(),
        userProfileImg: zod_1.z
            .union([zod_1.z.string(), zod_1.z.object({}).passthrough()])
            .optional(),
        designation: zod_1.z.string().optional(),
        rating: zod_1.z.coerce.number().min(1).max(5).optional(),
        comment: zod_1.z.string().optional(),
    }),
});
const idParamSchema = zod_1.z.object({
    id: zod_1.z
        .string()
        .min(1, { message: "ID is required" })
        .regex(/^[0-9a-fA-F]{24}$/, { message: "Invalid ID format" }),
});
exports.ReviewValidation = {
    createReviewSchema,
    updateReviewSchema,
    idParamSchema,
};
//# sourceMappingURL=review.validation.js.map