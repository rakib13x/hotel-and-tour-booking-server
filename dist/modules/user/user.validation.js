"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserValidation = exports.getUserValidation = exports.deleteUserValidation = exports.createUserValidation = exports.changeUserStatusValidation = exports.changeUserRoleValidation = void 0;
const zod_1 = require("zod");
const createUserValidation = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().min(1, "Name is required").optional(),
        email: zod_1.z.string().email("Invalid email format"),
        phone: zod_1.z
            .string()
            .min(10, "Phone number must be at least 10 characters")
            .optional(),
        profileImg: zod_1.z.string().url("Invalid profile image URL").optional(),
        password: zod_1.z.string().min(8, "Password must be at least 8 characters"),
        status: zod_1.z.enum(["active", "block", "deactive"]).optional(),
        role: zod_1.z.enum(["user", "admin", "super_admin"]).optional(),
    }),
});
exports.createUserValidation = createUserValidation;
const updateUserValidation = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().min(1, "Name is required").optional(),
        email: zod_1.z.string().email("Invalid email format").optional(),
        phone: zod_1.z
            .string()
            .min(10, "Phone number must be at least 10 characters")
            .optional(),
        profileImg: zod_1.z.string().url("Invalid profile image URL").optional(),
        password: zod_1.z
            .string()
            .min(8, "Password must be at least 8 characters")
            .optional(),
        status: zod_1.z.enum(["active", "block", "deactive"]).optional(),
        role: zod_1.z.enum(["user", "admin", "super_admin"]).optional(),
    }),
});
exports.updateUserValidation = updateUserValidation;
const getUserValidation = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().min(1, "User ID is required"),
    }),
});
exports.getUserValidation = getUserValidation;
const deleteUserValidation = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().min(1, "User ID is required"),
    }),
});
exports.deleteUserValidation = deleteUserValidation;
const changeUserStatusValidation = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().min(1, "User ID is required"),
    }),
    body: zod_1.z.object({
        status: zod_1.z.enum(["active", "block", "deactive"]),
    }),
});
exports.changeUserStatusValidation = changeUserStatusValidation;
const changeUserRoleValidation = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().min(1, "User ID is required"),
    }),
    body: zod_1.z.object({
        role: zod_1.z.enum(["user", "admin", "super_admin"]),
    }),
});
exports.changeUserRoleValidation = changeUserRoleValidation;
//# sourceMappingURL=user.validation.js.map