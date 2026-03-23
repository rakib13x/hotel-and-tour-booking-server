import { Types } from "mongoose";

export interface IBlog {
  title: string;
  category: Types.ObjectId; // This will be the category ID
  coverImage?: string;
  images?: string[];
  content: string;
  tags: string[];
  readTime: string;
  status: "draft" | "published";
}
