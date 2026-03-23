import { model, Schema } from "mongoose";

export interface ICategory {
  name: string;
}

const categorySchema = new Schema<ICategory>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: [2, "Category name must be at least 2 characters long"],
      maxlength: [50, "Category name must be less than 50 characters"],
      validate: {
        validator: function (v: string) {
          // Only allow letters, numbers, spaces, and hyphens
          return /^[a-zA-Z0-9\s-]+$/.test(v);
        },
        message:
          "Category name can only contain letters, numbers, spaces, and hyphens",
      },
    },
  },
  { timestamps: true }
);

export const Category = model<ICategory>("Category", categorySchema);
