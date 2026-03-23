import mongoose, { Schema } from "mongoose";
import { ITeam } from "../modules/team/team.interface";

const teamSchema = new Schema<ITeam>(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      maxlength: [100, "Name cannot exceed 100 characters"],
    },
    designation: {
      type: String,
      required: [true, "Designation is required"],
      trim: true,
      maxlength: [100, "Designation cannot exceed 100 characters"],
    },
    image: {
      type: String,
      required: [true, "Image is required"],
      trim: true,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Create indexes for better performance
teamSchema.index({ name: 1 });
teamSchema.index({ designation: 1 });

export const Team =
  (mongoose.models.Team as mongoose.Model<ITeam>) ||
  mongoose.model<ITeam>("Team", teamSchema);
