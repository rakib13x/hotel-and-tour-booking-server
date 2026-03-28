"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Category = void 0;
const mongoose_1 = require("mongoose");
const categorySchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: [2, "Category name must be at least 2 characters long"],
        maxlength: [50, "Category name must be less than 50 characters"],
        validate: {
            validator: function (v) {
                // Only allow letters, numbers, spaces, and hyphens
                return /^[a-zA-Z0-9\s-]+$/.test(v);
            },
            message: "Category name can only contain letters, numbers, spaces, and hyphens",
        },
    },
}, { timestamps: true });
exports.Category = (0, mongoose_1.model)("Category", categorySchema);
//# sourceMappingURL=category.model.js.map