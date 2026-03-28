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
exports.CustomTourQuery = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const customTourQuerySchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
        trim: true,
        maxlength: [100, "Name cannot exceed 100 characters"],
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        lowercase: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, "Please provide a valid email address"],
    },
    phone: {
        type: String,
        required: [true, "Phone number is required"],
        trim: true,
        maxlength: [20, "Phone number cannot exceed 20 characters"],
    },
    tourId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Tour",
        required: false,
    },
    tourTitle: {
        type: String,
        trim: true,
        maxlength: [200, "Tour title cannot exceed 200 characters"],
    },
    status: {
        type: String,
        enum: ["pending", "contacted", "closed"],
        default: "pending",
    },
}, {
    timestamps: true,
    versionKey: false,
});
// Create indexes for better query performance
customTourQuerySchema.index({ createdAt: -1 });
customTourQuerySchema.index({ status: 1 });
customTourQuerySchema.index({ email: 1 });
exports.CustomTourQuery = mongoose_1.default.models.CustomTourQuery ||
    (0, mongoose_1.model)("CustomTourQuery", customTourQuerySchema);
//# sourceMappingURL=customTourQuery.model.js.map