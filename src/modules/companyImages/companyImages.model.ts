import mongoose, { Document, Schema } from "mongoose";

export interface ICompanyImages extends Document {
  affiliation: string[];
  paymentAccept: string[];
  createdAt: Date;
  updatedAt: Date;
}

const companyImagesSchema: Schema = new Schema<ICompanyImages>(
  {
    affiliation: {
      type: [String],
      required: [true, "Affiliation images are required"],
    },
    paymentAccept: {
      type: [String],
      required: [true, "Payment accept images are required"],
    },
  },
  {
    timestamps: true,
  }
);

export const CompanyImages = mongoose.model<ICompanyImages>(
  "CompanyImages",
  companyImagesSchema
);
