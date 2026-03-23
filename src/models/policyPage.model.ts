import { model, Schema } from "mongoose";
import { IPolicyPage } from "../modules/policyPage/policyPage.interface";

const policyPageSchema = new Schema<IPolicyPage>(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
      enum: ['terms', 'privacy', 'refund'],
    },
    content: {
      type: String,
      required: true,
      default: '',
    },
  },
  { timestamps: true }
);

export const PolicyPage = model<IPolicyPage>("PolicyPage", policyPageSchema);

