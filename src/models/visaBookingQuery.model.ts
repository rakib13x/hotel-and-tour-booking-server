import { model, Schema, Types } from "mongoose";

export interface IVisaBookingQuery {
  _id?: Types.ObjectId;
  country: string;
  visaType: string;
  type: "query" | "application";
  name: string;
  email: string;
  phone: string;
  status: "pending" | "contacted" | "closed";
  createdAt?: Date;
  updatedAt?: Date;
}

const visaBookingQuerySchema = new Schema<IVisaBookingQuery>(
  {
    country: {
      type: String,
      required: [true, "Country is required"],
      trim: true,
      maxlength: [100, "Country name cannot exceed 100 characters"],
    },
    visaType: {
      type: String,
      required: [true, "Visa type is required"],
      trim: true,
      maxlength: [100, "Visa type cannot exceed 100 characters"],
    },
    type: {
      type: String,
      enum: ["query", "application"],
      default: "query",
      required: [true, "Type is required"],
    },
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
visaBookingQuerySchema.index({ createdAt: -1 });
visaBookingQuerySchema.index({ status: 1 });
visaBookingQuerySchema.index({ type: 1 });
visaBookingQuerySchema.index({ email: 1 });
visaBookingQuerySchema.index({ country: 1 });

export const VisaBookingQuery = model<IVisaBookingQuery>(
  "VisaBookingQuery",
  visaBookingQuerySchema
);
