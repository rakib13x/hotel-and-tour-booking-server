import { model, Schema } from "mongoose";
import { IBanner } from "../modules/banner/banner.interface";

const bannerSchema = new Schema<IBanner>(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    backgroundImage: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export const Banner = model<IBanner>("Banner", bannerSchema);
