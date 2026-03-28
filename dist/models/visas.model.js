"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.CountryVisa = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const visaTypeSchema = new mongoose_1.Schema({
    type: {
        type: String,
        enum: ["tourist visa", "sticker visa", "e-visa"],
        required: true,
    },
});
const countryVisaSchema = new mongoose_1.Schema({
    countryName: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    visaTypes: [
        {
            type: String,
            enum: ["tourist visa", "sticker visa", "e-visa"],
            required: true,
        },
    ],
    processingFee: {
        type: Number,
        min: 0,
    },
    required_document: {
        type: String,
        trim: true,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
}, { timestamps: true });
exports.CountryVisa = mongoose_1.default.models.CountryVisa ||
    (0, mongoose_1.model)("CountryVisa", countryVisaSchema);
//# sourceMappingURL=visas.model.js.map