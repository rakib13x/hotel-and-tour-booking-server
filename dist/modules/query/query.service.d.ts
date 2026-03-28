import { IQuery } from "../../models/query.model";
export declare const QueryService: {
    createQuery: (queryData: IQuery) => Promise<IQuery>;
    getAllQueries: (page?: number, limit?: number, sortBy?: string, sortOrder?: "asc" | "desc", search?: string, formType?: string, status?: string) => Promise<{
        queries: IQuery[];
        totalQueries: number;
        totalPages: number;
        currentPage: number;
        hasNextPage: boolean;
        hasPrevPage: boolean;
    }>;
    getQueryById: (queryId: string) => Promise<IQuery>;
    updateQueryById: (queryId: string, updateData: Partial<IQuery>) => Promise<IQuery>;
    deleteQueryById: (queryId: string) => Promise<void>;
    getQueryStats: () => Promise<{
        totalQueries: number;
        todayQueries: number;
        weekQueries: number;
        monthQueries: number;
        pendingQueries: number;
        reviewedQueries: number;
        contactedQueries: number;
        closedQueries: number;
        hajjUmrahQueries: number;
        packageTourQueries: number;
        groupTicketQueries: number;
    }>;
    getQueriesByFormType: (formType: string, page?: number, limit?: number) => Promise<{
        queries: IQuery[];
        totalQueries: number;
        totalPages: number;
        currentPage: number;
    }>;
    getMyQueries: (userId: string) => Promise<IQuery[]>;
};
//# sourceMappingURL=query.service.d.ts.map