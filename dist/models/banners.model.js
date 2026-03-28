"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Banner = void 0;
const mongoose_1 = require("mongoose");
const bannerSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    backgroundImage: {
        type: String,
        required: true,
    },
}, { timestamps: true });
exports.Banner = (0, mongoose_1.model)("Banner", bannerSchema);
//# sourceMappingURL=banners.model.js.map