import { Document } from "mongoose";

export interface ITeam extends Document {
  name: string;
  designation: string;
  image: string; // Image is required
  order?: number; // Order for sorting
  createdAt: Date;
  updatedAt: Date;
}

export interface ITeamCreate {
  name: string;
  designation: string;
  image: string; // Image is required
  order?: number; // Order for sorting
}

export interface ITeamUpdate {
  name?: string;
  designation?: string;
  image?: string;
}
