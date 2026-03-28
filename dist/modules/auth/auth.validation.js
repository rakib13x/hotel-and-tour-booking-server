"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.changePasswordValidation = exports.updateProfileValidation = exports.loginValidation = exports.registerValidation = void 0;
// src/modules/auth/auth.validation.ts
const { body } = require("express-validator");
exports.registerValidation = [
    body("name").notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Valid email is required"),
    body("password")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters"),
];
exports.loginValidation = [
    body("email").isEmail().withMessage("Valid email is required"),
    body("password").notEmpty().withMessage("Password is required"),
];
exports.updateProfileValidation = [
    body("name").optional().notEmpty().withMessage("Name cannot be empty"),
    body("email").optional().isEmail().withMessage("Valid email is required"),
    body("phone")
        .optional({ nullable: true, checkFalsy: true }) // Allow empty, null, or undefined
        .isLength({ min: 10 })
        .withMessage("Phone number must be at least 10 characters"),
    body("profileImg")
        .optional()
        .isURL()
        .withMessage("Profile image must be a valid URL"),
];
exports.changePasswordValidation = [
    body("currentPassword")
        .notEmpty()
        .withMessage("Current password is required"),
    body("newPassword")
        .isLength({ min: 6 })
        .withMessage("New password must be at least 6 characters"),
];
//# sourceMappingURL=auth.validation.js.map