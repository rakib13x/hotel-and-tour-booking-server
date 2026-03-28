import { ICompanyImages } from "./companyImages.model";
export declare const CompanyImagesService: {
    createCompanyImagesToDB: (payload: ICompanyImages) => Promise<ICompanyImages>;
    getAllCompanyImagesFromDB: () => Promise<ICompanyImages[]>;
    getCompanyImagesFromDB: (id: string) => Promise<ICompanyImages | null>;
    updateCompanyImagesToDB: (id: string, payload: Partial<ICompanyImages>) => Promise<ICompanyImages | null>;
    deleteCompanyImagesFromDB: (id: string) => Promise<ICompanyImages | null>;
    deleteSpecificImageFromDB: (id: string, fieldType: string, imageUrl: string) => Promise<ICompanyImages | null>;
};
//# sourceMappingURL=companyImages.service.d.ts.map