import mongoose, { Document } from "mongoose";
export interface ICompanyInfo extends Document {
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
    youtube_video?: string;
    yearsOfExperience: number;
    openingHours: string;
    close: "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday";
    createdAt: Date;
    updatedAt: Date;
}
declare const CompanyInfo: mongoose.Model<ICompanyInfo, {}, {}, {}, mongoose.Document<unknown, {}, ICompanyInfo, {}, {}> & ICompanyInfo & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default CompanyInfo;
//# sourceMappingURL=companyInfo.model.d.ts.map