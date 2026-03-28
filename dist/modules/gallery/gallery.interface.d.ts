import { Document } from "mongoose";
export interface ICategory extends Document {
    name: string;
    image: string;
    isActive?: boolean;
    createdAt: Date;
    updatedAt: Date;
}
export interface ISubCategory extends Document {
    categoryId: string;
    name: string;
    image: string;
    isActive?: boolean;
    createdAt: Date;
    updatedAt: Date;
}
export interface IImage extends Document {
    subCategoryId: string;
    url: string;
    altText?: string;
    isActive?: boolean;
    createdAt: Date;
    updatedAt: Date;
}
//# sourceMappingURL=gallery.interface.d.ts.map