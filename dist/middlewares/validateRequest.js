"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const { validationResult } = require('express-validator');
const ApiError_1 = __importDefault(require("../utils/ApiError"));
const validateRequest = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const errorMessages = errors.array().map((error) => error.msg);
        return next(new ApiError_1.default(400, errorMessages.join(', ')));
    }
    next();
};
exports.default = validateRequest;
//# sourceMappingURL=validateRequest.js.map