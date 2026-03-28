import { IReview } from "./review.interface";
export declare const ReviewService: {
    createReviewService: (reviewData: IReview) => Promise<any>;
    getAllReviewServiceFromDB: (query: Record<string, any>) => Promise<{
        pagination: {
            page: number;
            limit: number;
            total: number;
            pages: number;
        };
        data: any[];
    }>;
    getSingleReviewServiceFromDB: (id: string) => Promise<any>;
    updateReviewServiceFromDB: (id: string, reviewData: IReview, files: any) => Promise<any>;
    deleteReviewServiceFromDB: (id: string) => Promise<any>;
    reorderReviewsService: (reviewIds: string[]) => Promise<any[]>;
};
//# sourceMappingURL=review.service.d.ts.map