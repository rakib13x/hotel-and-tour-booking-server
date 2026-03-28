import { ICompanyInfo } from "./companyInfo.interface";
export declare const CompanyInfoService: {
    createCompanyInfoToDB: (payload: ICompanyInfo) => Promise<ICompanyInfo>;
    getCompanyInfoFromDB: (id?: string) => Promise<ICompanyInfo | ICompanyInfo[]>;
    updateCompanyInfoToDB: (id: string, payload: Partial<ICompanyInfo>) => Promise<ICompanyInfo>;
    deleteCompanyInfoFromDB: (id: string) => Promise<void>;
};
//# sourceMappingURL=companyInfo.service.d.ts.map