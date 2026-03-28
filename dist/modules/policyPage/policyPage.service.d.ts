import { IPolicyPage } from "./policyPage.interface";
import mongoose from "mongoose";
export declare const PolicyPageService: {
    createPolicyPageIntoDB: (payload: IPolicyPage) => Promise<IPolicyPage>;
    getAllPolicyPagesFromDB: (query: Record<string, any>) => Promise<{
        data: (mongoose.Document<unknown, {}, IPolicyPage, {}, {}> & IPolicyPage & {
            _id: mongoose.Types.ObjectId;
        } & {
            __v: number;
        })[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            pages: number;
        };
    }>;
    getSinglePolicyPageFromDB: (id: string) => Promise<IPolicyPage | null>;
    getPolicyPageBySlugFromDB: (slug: string) => Promise<IPolicyPage | null>;
    updatePolicyPageIntoDB: (id: string, payload: Partial<IPolicyPage>) => Promise<IPolicyPage | null>;
    deletePolicyPageFromDB: (id: string) => Promise<IPolicyPage | null>;
};
//# sourceMappingURL=policyPage.service.d.ts.map