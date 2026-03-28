"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const review_model_1 = __importDefault(require("../models/review.model"));
const initializeReviewOrders = async () => {
    try {
        // Connect to MongoDB
        await mongoose_1.default.connect(process.env.DATABASE_URL);
        console.log("Connected to MongoDB");
        // Get all reviews and update their order field
        const reviews = await review_model_1.default.find({}).sort({ createdAt: 1 });
        console.log(`Found ${reviews.length} reviews to update`);
        // Update each review with an order number based on creation date
        for (let i = 0; i < reviews.length; i++) {
            const review = reviews[i];
            if (review && review._id) {
                await review_model_1.default.findByIdAndUpdate(review._id, { order: i + 1 });
                console.log(`Updated review ${i + 1}/${reviews.length}: ${review.userName}`);
            }
        }
        console.log("All reviews have been updated with order numbers");
        process.exit(0);
    }
    catch (error) {
        console.error("Error initializing review orders:", error);
        process.exit(1);
    }
};
// Run the script
initializeReviewOrders();
//# sourceMappingURL=initialize-review-orders.js.map