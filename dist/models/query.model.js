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
exports.Query = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const querySchema = new mongoose_1.Schema({
    // Form identification
    formType: {
        type: String,
        enum: ["hajj_umrah", "package_tour", "group_ticket"],
        required: [true, "Form type is required"],
    },
    // Common fields
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
    contactNumber: {
        type: String,
        required: [true, "Contact number is required"],
        trim: true,
        maxlength: [20, "Contact number cannot exceed 20 characters"],
    },
    startingDate: {
        type: Date,
        required: [true, "Starting date is required"],
    },
    returnDate: {
        type: Date,
        required: [true, "Return date is required"],
        validate: {
            validator: function (value) {
                return value > this.startingDate;
            },
            message: "Return date must be after starting date",
        },
    },
    airlineTicketCategory: {
        type: String,
        enum: ["economy", "business", "first_class"],
        required: [true, "Airline ticket category is required"],
    },
    specialRequirements: {
        type: String,
        trim: true,
        maxlength: [1000, "Special requirements cannot exceed 1000 characters"],
    },
    // Hajj & Umrah specific fields
    nightsStayMakkah: {
        type: Number,
        default: 0,
        min: [0, "Nights stay in Makkah cannot be negative"],
    },
    nightsStayMadinah: {
        type: Number,
        default: 0,
        min: [0, "Nights stay in Madinah cannot be negative"],
    },
    maleAdults: {
        type: Number,
        default: 0,
        min: [0, "Male adults count cannot be negative"],
    },
    femaleAdults: {
        type: Number,
        default: 0,
        min: [0, "Female adults count cannot be negative"],
    },
    childs: {
        type: Number,
        default: 0,
        min: [0, "Children count cannot be negative"],
    },
    accommodationType: {
        type: String,
        enum: ["2_star", "3_star", "4_star", "5_star"],
    },
    foodsIncluded: {
        type: Boolean,
        default: false,
    },
    guideRequired: {
        type: Boolean,
        default: false,
    },
    privateTransportation: {
        type: Boolean,
        default: false,
    },
    // Package Tour specific fields
    visitingCountry: {
        type: String,
        trim: true,
        maxlength: [100, "Visiting country cannot exceed 100 characters"],
    },
    visitingCities: {
        type: String,
        trim: true,
        maxlength: [500, "Visiting cities cannot exceed 500 characters"],
    },
    // Group Ticket specific fields
    totalPassengers: {
        type: Number,
        default: 0,
        min: [0, "Total passengers cannot be negative"],
    },
    // Query Status
    status: {
        type: String,
        enum: ["pending", "reviewed", "contacted", "closed"],
        default: "pending",
    },
}, {
    timestamps: true,
    versionKey: false,
});
// Create indexes for better query performance
querySchema.index({ createdAt: -1 });
querySchema.index({ status: 1 });
querySchema.index({ formType: 1 });
querySchema.index({ email: 1 });
exports.Query = mongoose_1.default.models.Query ||
    (0, mongoose_1.model)("Query", querySchema);
//# sourceMappingURL=query.model.js.map