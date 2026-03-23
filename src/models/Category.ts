import mongoose, { Document, Schema } from "mongoose";

export interface ICategory extends Document {
  category_name: string;
  img?: string; // Cloudinary URL
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

const CategorySchema = new Schema<ICategory>(
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

export default mongoose.models.Category ||
  mongoose.model<ICategory>("Category", CategorySchema);
