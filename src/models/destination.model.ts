import { Schema, model, Types } from "mongoose";

export interface IDestination {
  _id: Types.ObjectId;
  country: string;          // "Cambodia"
  city?: string;            // "Siem Reap"
  slug: string;             // "siem-reap-cambodia"
}

const DestinationSchema = new Schema<IDestination>(
  {
    country: { type: String, required: true, trim: true },
    city: { type: String, trim: true },
    slug: { type: String, required: true, unique: true, index: true },
  },
  { timestamps: true }
);

export const Destination = model<IDestination>("Destination", DestinationSchema);
