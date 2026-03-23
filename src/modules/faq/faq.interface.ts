import { Document } from "mongoose";

export interface IFaq extends Document {
  question: string;
  answer: string;
  orderIndex: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IFaqFilters {
  search?: string;
  isActive?: boolean;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface IFaqStats {
  total: number;
  active: number;
  inactive: number;
}

export interface IReorderFaq {
  id: string;
  orderIndex: number;
}

export interface IReorderFaqs {
  faqs: IReorderFaq[];
}
