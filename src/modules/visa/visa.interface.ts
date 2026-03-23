import { Document } from "mongoose";

export interface IVisaType {
  type: "tourist visa" | "sticker visa" | "e-visa";
}

export interface ICountryVisa extends Document {
  countryName: string;
  visaTypes: string[];
  processingFee?: number;
  required_document?: string;
  isActive?: boolean;
  createdAt: Date;
  updatedAt: Date;
}
