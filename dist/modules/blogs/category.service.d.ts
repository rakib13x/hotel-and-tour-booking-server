import { Types } from "mongoose";
import { ICategory } from "../../models/category.model";
export declare const CategoryService: {
    findOrCreateCategory: (categoryName: string) => Promise<Types.ObjectId>;
    getAllCategories: () => Promise<ICategory[]>;
    createCategory: (payload: {
        name: string;
    }) => Promise<ICategory>;
    getSingleCategory: (id: string) => Promise<ICategory | null>;
    updateCategory: (id: string, payload: {
        name: string;
    }) => Promise<ICategory | null>;
    deleteCategory: (id: string) => Promise<ICategory | null>;
};
//# sourceMappingURL=category.service.d.ts.map