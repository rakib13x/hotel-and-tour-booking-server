import mongoose, { model, Schema } from "mongoose";
import { IBlog } from "../modules/blogs/blogs.interface";

const blogSchema = new Schema<IBlog>(
  {
    title: { type: String, required: true },
    category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
    coverImage: { type: String, required: true },
    images: { type: [String], default: [] },
    content: { type: String, required: true },
    tags: { type: [String], required: true },
    readTime: { type: String, required: true },
    status: { type: String, enum: ["draft", "published"], default: "draft" },
  },
  { timestamps: true }
);

export const Blog =
  (mongoose.models.Blog as mongoose.Model<IBlog>) ||
  model<IBlog>("Blog", blogSchema);
