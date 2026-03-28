import mongoose, { Document, Schema } from "mongoose";

export interface ICountry extends Document {
  name: string; // e.g. "Bangladesh"

  imageUrl: string; // single Cloudinary URL for country image

  isTop: boolean; // whether this is a top/featured country

  createdAt: Date;
  updatedAt: Date;
}

const CountrySchema = new Schema<ICountry>(
  {
    name: { type: String, required: true, unique: true },

    imageUrl: { type: String, required: true },

    isTop: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.models.Country ||
  mongoose.model<ICountry>("Country", CountrySchema);
