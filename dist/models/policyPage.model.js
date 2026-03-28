"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PolicyPage = void 0;
const mongoose_1 = require("mongoose");
const policyPageSchema = new mongoose_1.Schema({
    slug: {
        type: String,
        required: true,
        unique: true,
        enum: ['terms', 'privacy', 'refund'],
    },
    content: {
        type: String,
        required: true,
        default: '',
    },
}, { timestamps: true });
exports.PolicyPage = (0, mongoose_1.model)("PolicyPage", policyPageSchema);
//# sourceMappingURL=policyPage.model.js.map