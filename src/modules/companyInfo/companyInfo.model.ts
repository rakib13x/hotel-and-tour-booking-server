import mongoose, { Document, Schema } from "mongoose";

export interface ICompanyInfo extends Document {
  companyName: string;
  logo: string;
  email: string[];
  phone: string[];
  address: string;
  googleMapUrl?: string;
  description?: string;
  socialLinks: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
    youtube?: string;
    tiktok?: string;
  };
  youtube_video?: string;
  yearsOfExperience: number;
  openingHours: string; // e.g., "09:00 AM - 06:00 PM"
  close:
    | "Monday"
    | "Tuesday"
    | "Wednesday"
    | "Thursday"
    | "Friday"
    | "Saturday"
    | "Sunday";
  createdAt: Date;
  updatedAt: Date;
}

const companyInfoSchema: Schema = new Schema(
  {
    companyName: { type: String, required: true },
    logo: { type: String, required: true },
    email: [{ type: String, required: true }],
    phone: [{ type: String, required: true }],
    address: { type: String, required: true },
    googleMapUrl: { type: String },
    description: { type: String },
    socialLinks: {
      facebook: { type: String },
      twitter: { type: String },
      instagram: { type: String },
      linkedin: { type: String },
      youtube: { type: String },
      tiktok: { type: String },
    },
    youtube_video: { type: String },
    yearsOfExperience: {
      type: Number,
      required: true,
      default: 0,
    },
    openingHours: {
      type: String,
      required: true,
      default: "09:00 AM - 06:00 PM",
    }, // e.g., "09:00 AM - 06:00 PM"
    close: {
      type: String,
      required: true,
      default: "Friday",
      enum: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
    },
  },
  { timestamps: true }
);

const CompanyInfo = mongoose.model<ICompanyInfo>(
  "CompanyInfo",
  companyInfoSchema
);

export default CompanyInfo;
