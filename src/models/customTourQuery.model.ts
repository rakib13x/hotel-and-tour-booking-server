import mongoose, { model, Schema, Types } from "mongoose";

export interface ICustomTourQuery {
  _id?: Types.ObjectId;
  name: string;
  email: string;
  phone: string;
  tourId?: Types.ObjectId; // Optional: Reference to specific tour
  tourTitle?: string; // Store tour title for reference
  status: "pending" | "contacted" | "closed";
  createdAt?: Date;
  updatedAt?: Date;
}

const customTourQuerySchema = new Schema<ICustomTourQuery>(
  {
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
      type: Schema.Types.ObjectId,
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
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Create indexes for better query performance
customTourQuerySchema.index({ createdAt: -1 });
customTourQuerySchema.index({ status: 1 });
customTourQuerySchema.index({ email: 1 });

export const CustomTourQuery =
  (mongoose.models.CustomTourQuery as mongoose.Model<ICustomTourQuery>) ||
  model<ICustomTourQuery>("CustomTourQuery", customTourQuerySchema);
