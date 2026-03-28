import mongoose from "mongoose";
import { IBanner } from "./banner.interface";
interface CreateBannerInput {
    title: string;
    description: string;
    backgroundImage: string[];
    isActive?: boolean;
}
interface UpdateBannerInput extends Partial<CreateBannerInput> {
}
export declare const BannerService: {
    createBannerIntoDB: (payload: CreateBannerInput) => Promise<IBanner>;
    getAllBannersFromDB: (query: Record<string, any>) => Promise<{
        data: (mongoose.Document<unknown, {}, IBanner, {}, {}> & IBanner & Required<{
            _id: mongoose.Types.ObjectId;
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
    getSingleBannerFromDB: (id: string) => Promise<IBanner | null>;
    updateBannerIntoDB: (id: string, payload: UpdateBannerInput) => Promise<IBanner | null>;
    getActiveBannersFromDB: () => Promise<IBanner[]>;
    deleteBannerFromDB: (id: string) => Promise<IBanner | null>;
    toggleBannerStatusInDB: (id: string, isActive: boolean) => Promise<IBanner | null>;
};
export {};
//# sourceMappingURL=banner.service.d.ts.map