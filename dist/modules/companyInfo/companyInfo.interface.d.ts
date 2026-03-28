import { Model } from "mongoose";
export type ICompanyInfo = {
    companyName: string;
    logo: string;
    email: string[];
    phone: string[];
    address: string;
    googleMapUrl?: string;
    description?: string;
    socialLinks: {
        facebook?: string;
        twitter?: string;
        instagram?: string;
        linkedin?: string;
        youtube?: string;
        tiktok?: string;
    };
    yearsOfExperience: number;
    openingHours: string;
    close: "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday";
};
export type CompanyInfoModel = Model<ICompanyInfo>;
//# sourceMappingURL=companyInfo.interface.d.ts.map