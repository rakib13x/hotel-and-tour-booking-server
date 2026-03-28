"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthorizationValidation = void 0;
const zod_1 = require("zod");
// Create authorization (form-data) - validates request body directly
const createAuthorizationValidation = zod_1.z.object({
    image: zod_1.z.string().optional(),
});
// Create authorization with JSON - validates request body wrapped in body object
const createAuthorizationWithJsonValidation = zod_1.z.object({
    body: zod_1.z.object({
        image: zod_1.z.string().url("Invalid image URL").optional(),
    }),
});
// Update authorization (form-data) - validates request body directly
const updateAuthorizationValidation = zod_1.z.object({
    image: zod_1.z.string().optional(),
});
// Update authorization with JSON - validates request body wrapped in body object
const updateAuthorizationWithJsonValidation = zod_1.z.object({
    body: zod_1.z.object({
        image: zod_1.z.string().url("Invalid image URL").optional(),
    }),
});
const getSingleAuthorizationValidation = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().min(1, "Authorization ID is required"),
    }),
});
const deleteAuthorizationValidation = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().min(1, "Authorization ID is required"),
    }),
});
exports.AuthorizationValidation = {
    createAuthorizationValidation,
    createAuthorizationWithJsonValidation,
    updateAuthorizationValidation,
    updateAuthorizationWithJsonValidation,
    getSingleAuthorizationValidation,
    deleteAuthorizationValidation,
};
//# sourceMappingURL=authorization.validation.js.map