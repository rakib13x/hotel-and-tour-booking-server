"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reorderTeamsValidation = exports.idParamValidation = exports.updateTeamWithImageValidation = exports.updateTeamValidation = exports.createTeamWithUrlValidation = exports.createTeamValidation = void 0;
const zod_1 = require("zod");
// Create team (form-data) - validates full request structure
exports.createTeamValidation = zod_1.z.object({
    params: zod_1.z.object({}).optional(),
    query: zod_1.z.object({}).optional(),
    body: zod_1.z.object({
        name: zod_1.z
            .string()
            .min(1, { message: "Name is required" })
            .max(100, { message: "Name cannot exceed 100 characters" }),
        designation: zod_1.z
            .string()
            .min(1, { message: "Designation is required" })
            .max(100, { message: "Designation cannot exceed 100 characters" }),
    }),
});
// Create team with image URL (JSON) - validates request body
exports.createTeamWithUrlValidation = zod_1.z.object({
    name: zod_1.z
        .string()
        .min(1, { message: "Name is required" })
        .max(100, { message: "Name cannot exceed 100 characters" }),
    designation: zod_1.z
        .string()
        .min(1, { message: "Designation is required" })
        .max(100, { message: "Designation cannot exceed 100 characters" }),
    image: zod_1.z
        .string()
        .min(1, { message: "Image URL cannot be empty" })
        .url({ message: "Please provide a valid image URL" }),
});
// Update team - validates request body
exports.updateTeamValidation = zod_1.z.object({
    name: zod_1.z
        .string()
        .min(1, { message: "Name cannot be empty" })
        .max(100, { message: "Name cannot exceed 100 characters" })
        .optional(),
    designation: zod_1.z
        .string()
        .min(1, { message: "Designation cannot be empty" })
        .max(100, { message: "Designation cannot exceed 100 characters" })
        .optional(),
    image: zod_1.z
        .string()
        .min(1, { message: "Image URL cannot be empty" })
        .url({ message: "Please provide a valid image URL" })
        .optional(),
});
// Update team with image - validates full request structure
exports.updateTeamWithImageValidation = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z
            .string()
            .min(1, { message: "Team ID is required" })
            .regex(/^[0-9a-fA-F]{24}$/, { message: "Invalid team ID format" }),
    }),
    query: zod_1.z.object({}).optional(),
    body: zod_1.z.object({
        name: zod_1.z
            .string()
            .min(1, { message: "Name cannot be empty" })
            .max(100, { message: "Name cannot exceed 100 characters" })
            .optional(),
        designation: zod_1.z
            .string()
            .min(1, { message: "Designation cannot be empty" })
            .max(100, { message: "Designation cannot exceed 100 characters" })
            .optional(),
    }),
});
// ID parameter validation for routes
exports.idParamValidation = zod_1.z.object({
    id: zod_1.z
        .string()
        .min(1, { message: "Team ID is required" })
        .regex(/^[0-9a-fA-F]{24}$/, { message: "Invalid team ID format" }),
});
// Reorder team members validation
exports.reorderTeamsValidation = zod_1.z.object({
    teamIds: zod_1.z
        .array(zod_1.z
        .string()
        .regex(/^[0-9a-fA-F]{24}$/, { message: "Invalid team ID format" }))
        .min(1, { message: "At least one team ID is required" })
        .max(100, { message: "Too many team members to reorder" }),
});
//# sourceMappingURL=team.validation.js.map