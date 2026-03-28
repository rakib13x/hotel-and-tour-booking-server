"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const logger_1 = __importDefault(require("./logger"));
const connectDB = async (mongoURI) => {
    try {
        await mongoose_1.default.connect(mongoURI);
        logger_1.default.info("✅ MongoDB connected successfully");
    }
    catch (error) {
        logger_1.default.error("❌ MongoDB connection failed:", error);
        process.exit(1); // exit app if DB fails
    }
};
exports.default = connectDB;
//# sourceMappingURL=db.js.map