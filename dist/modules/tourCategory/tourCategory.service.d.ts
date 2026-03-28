import { ITourCategory } from "../../models/TourCategory";
import { PaginationResult } from "../../utils/pagination";
interface CreateTourCategoryInput {
    category_name: string;
    img?: string;
    description?: string;
}
interface UpdateTourCategoryInput extends Partial<CreateTourCategoryInput> {
}
interface GetTourCategoriesQuery {
    page?: number;
    limit?: number;
    search?: string;
}
declare class TourCategoryService {
    createTourCategory(input: CreateTourCategoryInput): Promise<ITourCategory>;
    getTourCategories(query: GetTourCategoriesQuery): Promise<PaginationResult<ITourCategory>>;
    getAllActiveTourCategories(): Promise<ITourCategory[]>;
    getTourCategoryById(id: string): Promise<ITourCategory>;
    updateTourCategory(id: string, input: UpdateTourCategoryInput): Promise<ITourCategory>;
    deleteTourCategory(id: string): Promise<void>;
}
declare const _default: TourCategoryService;
export default _default;
//# sourceMappingURL=tourCategory.service.d.ts.map