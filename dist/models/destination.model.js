"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Destination = void 0;
const mongoose_1 = require("mongoose");
const DestinationSchema = new mongoose_1.Schema({
    country: { type: String, required: true, trim: true },
    city: { type: String, trim: true },
    slug: { type: String, required: true, unique: true, index: true },
}, { timestamps: true });
exports.Destination = (0, mongoose_1.model)("Destination", DestinationSchema);
//# sourceMappingURL=destination.model.js.map