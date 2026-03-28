import mongoose, { model, Schema } from "mongoose";

export interface ICorporateClient {
  name: string;
  logo: string;
  order?: number;
}

const corporateClientSchema = new Schema<ICorporateClient>(
  {
    name: {
      type: String,
      required: [true, "Client name is required"],
      trim: true,
      minlength: [2, "Client name must be at least 2 characters long"],
      maxlength: [100, "Client name must be less than 100 characters"],
    },
    logo: {
      type: String,
      required: [true, "Client logo is required"],
      trim: true,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// Add index for order field
corporateClientSchema.index({ order: 1 });

export const CorporateClient =
  (mongoose.models.CorporateClient as mongoose.Model<ICorporateClient>) ||
  model<ICorporateClient>("CorporateClient", corporateClientSchema);
