import { ICategory, IImage, ISubCategory } from "./gallery.interface";
export declare const GalleryService: {
    createCategoryIntoDB: (payload: {
        name: string;
        image?: string;
        isActive?: boolean;
    }) => Promise<ICategory>;
    getAllCategoriesFromDB: (query: Record<string, any>) => Promise<{
        data: (import("mongoose").Document<unknown, {}, ICategory, {}, {}> & ICategory & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        })[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            pages: number;
        };
    }>;
    getActiveCategoriesFromDB: () => Promise<ICategory[]>;
    getSingleCategoryFromDB: (id: string) => Promise<ICategory | null>;
    updateCategoryIntoDB: (id: string, payload: {
        name?: string;
        image?: string;
        isActive?: boolean;
    }) => Promise<ICategory | null>;
    deleteCategoryFromDB: (id: string) => Promise<ICategory | null>;
    createSubCategoryIntoDB: (payload: {
        categoryId: string;
        name: string;
        image?: string;
        isActive?: boolean;
    }) => Promise<ISubCategory>;
    getAllSubCategoriesFromDB: (query: Record<string, any>) => Promise<{
        data: (import("mongoose").Document<unknown, {}, ISubCategory, {}, {}> & ISubCategory & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        })[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            pages: number;
        };
    }>;
    getSubCategoriesByCategoryFromDB: (categoryId: string) => Promise<ISubCategory[]>;
    getSingleSubCategoryFromDB: (id: string) => Promise<ISubCategory | null>;
    updateSubCategoryIntoDB: (id: string, payload: {
        categoryId?: string;
        name?: string;
        image?: string;
        isActive?: boolean;
    }) => Promise<ISubCategory | null>;
    deleteSubCategoryFromDB: (id: string) => Promise<ISubCategory | null>;
    createImageIntoDB: (payload: {
        subCategoryId: string;
        url: string;
        altText?: string;
        isActive?: boolean;
    }) => Promise<IImage>;
    getAllImagesFromDB: (query: Record<string, any>) => Promise<{
        data: (import("mongoose").Document<unknown, {}, IImage, {}, {}> & IImage & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        })[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            pages: number;
        };
    }>;
    getImagesBySubCategoryFromDB: (subCategoryId: string) => Promise<IImage[]>;
    getSingleImageFromDB: (id: string) => Promise<IImage | null>;
    updateImageIntoDB: (id: string, payload: {
        subCategoryId?: string;
        url?: string;
        altText?: string;
        isActive?: boolean;
    }) => Promise<IImage | null>;
    deleteImageFromDB: (id: string) => Promise<IImage | null>;
};
//# sourceMappingURL=gallery.service.d.ts.map