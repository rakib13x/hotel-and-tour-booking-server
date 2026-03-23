import mongoose, { model, Schema } from "mongoose";
import { ICountryVisa } from "../modules/visa/visa.interface";

const visaTypeSchema = new Schema({
  type: {
    type: String,
    enum: ["tourist visa", "sticker visa", "e-visa"],
    required: true,
  },
});

const countryVisaSchema = new Schema<ICountryVisa>(
  {
    countryName: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    visaTypes: [
      {
        type: String,
        enum: ["tourist visa", "sticker visa", "e-visa"],
        required: true,
      },
    ],
    processingFee: {
      type: Number,
      min: 0,
    },
    required_document: {
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

export const CountryVisa =
  (mongoose.models.CountryVisa as mongoose.Model<ICountryVisa>) ||
  model<ICountryVisa>("CountryVisa", countryVisaSchema);
