import { IFaq, IFaqFilters, IFaqStats, IReorderFaqs } from "./faq.interface";
export declare const FaqService: {
    createFaqIntoDB: (payload: any) => Promise<IFaq>;
    getAllFaqsFromDB: (query?: IFaqFilters) => Promise<{
        data: (import("mongoose").Document<unknown, {}, import("../../models/faq.model").IFaq, {}, {}> & import("../../models/faq.model").IFaq & Required<{
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
    getSingleFaqFromDB: (id: string) => Promise<IFaq | null>;
    updateFaqIntoDB: (id: string, payload: any) => Promise<IFaq | null>;
    deleteFaqFromDB: (id: string) => Promise<IFaq | null>;
    toggleFaqStatusFromDB: (id: string) => Promise<IFaq | null>;
    reorderFaqsFromDB: (data: IReorderFaqs) => Promise<void>;
    getActiveFaqsFromDB: () => Promise<IFaq[]>;
    getFaqStatsFromDB: () => Promise<IFaqStats>;
};
//# sourceMappingURL=faq.service.d.ts.map