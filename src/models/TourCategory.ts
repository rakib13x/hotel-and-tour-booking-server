import mongoose, { Document, Schema } from "mongoose";

export interface ITourCategory extends Document {
  category_name: string;
  img?: string; // Cloudinary URL
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

const TourCategorySchema = new Schema<ITourCategory>(
  {
    category_name: {
      type: String,
      required: [true, "Category name is required"],
      trim: true,
      unique: true,
    },
    img: {
      type: String, // Cloudinary secure_url
    },
    description: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.TourCategory ||
  mongoose.model<ITourCategory>("TourCategory", TourCategorySchema);
