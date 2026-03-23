import mongoose, { model, Schema } from "mongoose";
import {
  ICategory,
  IImage,
  ISubCategory,
} from "../modules/gallery/gallery.interface";

// Category Schema
const categorySchema = new Schema<ICategory>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    image: {
      type: String,
      required: true,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// SubCategory Schema
const subCategorySchema = new Schema<ISubCategory>(
  {
    categoryId: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      type: String,
      required: true,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Image Schema
const imageSchema = new Schema<IImage>(
  {
    subCategoryId: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
      trim: true,
    },
    altText: {
      type: String,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export const Category =
  (mongoose.models.GalleryCategory as mongoose.Model<ICategory>) ||
  model<ICategory>("GalleryCategory", categorySchema);
export const SubCategory =
  (mongoose.models.GallerySubCategory as mongoose.Model<ISubCategory>) ||
  model<ISubCategory>("GallerySubCategory", subCategorySchema);
export const Image =
  (mongoose.models.GalleryImage as mongoose.Model<IImage>) ||
  model<IImage>("GalleryImage", imageSchema);
