import TourCategory, { ITourCategory } from "../../models/TourCategory";
import { PaginationResult } from "../../utils/pagination";

interface CreateTourCategoryInput {
  category_name: string;
  img?: string;
  description?: string;
}

interface UpdateTourCategoryInput extends Partial<CreateTourCategoryInput> {}

interface GetTourCategoriesQuery {
  page?: number;
  limit?: number;
  search?: string;
}

class TourCategoryService {
  async createTourCategory(
    input: CreateTourCategoryInput
  ): Promise<ITourCategory> {
    const tourCategory = new TourCategory(input);
    return await tourCategory.save();
  }

  async getTourCategories(
    query: GetTourCategoriesQuery
  ): Promise<PaginationResult<ITourCategory>> {
    const { page = 1, limit = 10, search } = query;
    const skip = (page - 1) * limit;

    // Build filter object
    const filter: any = {};

    if (search) {
      filter.category_name = { $regex: search, $options: "i" };
    }

    const [tourCategories, total] = await Promise.all([
      (TourCategory as any)
        .find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      (TourCategory as any).countDocuments(filter),
    ]);

    const pages = Math.ceil(total / limit);
    const hasNext = page < pages;
    const hasPrev = page > 1;

    return {
      data: tourCategories as ITourCategory[],
      pagination: {
        page,
        limit,
        total,
        pages,
        hasNext,
        hasPrev,
        ...(hasNext && { next: page + 1 }),
        ...(hasPrev && { prev: page - 1 }),
      },
    };
  }

  async getAllActiveTourCategories(): Promise<ITourCategory[]> {
    return await (TourCategory as any).find({}).sort({ createdAt: -1 });
  }

  async getTourCategoryById(id: string): Promise<ITourCategory> {
    const tourCategory = await (TourCategory as any).findById(id);
    if (!tourCategory) {
      throw new Error("Tour category not found");
    }
    return tourCategory;
  }

  async updateTourCategory(
    id: string,
    input: UpdateTourCategoryInput
  ): Promise<ITourCategory> {
    const tourCategory = await (TourCategory as any).findByIdAndUpdate(
      id,
      { ...input },
      { new: true, runValidators: true }
    );

    if (!tourCategory) {
      throw new Error("Tour category not found");
    }

    return tourCategory;
  }

  async deleteTourCategory(id: string): Promise<void> {
    const result = await (TourCategory as any).findByIdAndDelete(id);
    if (!result) {
      throw new Error("Tour category not found");
    }
  }
}

export default new TourCategoryService();
