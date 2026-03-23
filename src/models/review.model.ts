import mongoose, { Document, Schema } from "mongoose";

export interface IReviewDocument extends Document {
  userName: string;
  userProfileImg?: string; // Cloudinary public_id or URL
  designation: string;
  rating: number; // 1-5
  comment: string;
  order: number; // For drag and drop ordering
  // tourImages?: string[]; // Array of Cloudinary public_ids or URLs
  createdAt: Date;
  updatedAt: Date;
}

const ReviewSchema = new Schema<IReviewDocument>(
  {
    userName: {
      type: String,
      required: [true, "User name is required"],
      trim: true,
      maxlength: [100, "User name cannot exceed 100 characters"],
    },
    userProfileImg: {
      type: String,
      trim: true,
    },
    designation: {
      type: String,
      default: "Traveller",
      trim: true,
      maxlength: [100, "Designation cannot exceed 100 characters"],
    },
    rating: {
      type: Number,
      required: [true, "Rating is required"],
      min: [1, "Rating must be at least 1"],
      max: [5, "Rating must be at most 5"],
    },
    comment: {
      type: String,
      required: [true, "Comment is required"],
      trim: true,
      maxlength: [2000, "Comment cannot exceed 2000 characters"],
    },
    order: {
      type: Number,
      default: 0,
    },
    // tourImages: [{ type: String, trim: true }],
  },
  { timestamps: true }
);

ReviewSchema.index({ userName: 1 });
ReviewSchema.index({ designation: 1 });
ReviewSchema.index({ rating: -1 });
ReviewSchema.index({ order: 1 });

const Review =
  (mongoose.models.Review as mongoose.Model<IReviewDocument>) ||
  mongoose.model<IReviewDocument>("Review", ReviewSchema);

export default Review;
