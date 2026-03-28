import { IVisaBookingQuery } from "../../models/visaBookingQuery.model";
import { PaginationResult } from "../../utils/pagination";
interface CreateVisaBookingQueryInput {
    country: string;
    visaType: string;
    type?: "query" | "application";
    name: string;
    email: string;
    phone: string;
}
interface UpdateVisaBookingQueryInput {
    status: "pending" | "contacted" | "closed";
}
interface GetVisaBookingQueriesOptions {
    page?: number;
    limit?: number;
    search?: string;
    status?: "pending" | "contacted" | "closed";
    type?: "query" | "application";
    country?: string;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
}
declare class VisaBookingQueryService {
    createVisaBookingQuery(input: CreateVisaBookingQueryInput): Promise<IVisaBookingQuery>;
    getVisaBookingQueries(options: GetVisaBookingQueriesOptions): Promise<PaginationResult<IVisaBookingQuery>>;
    getVisaBookingQueryById(id: string): Promise<IVisaBookingQuery>;
    updateVisaBookingQueryStatus(id: string, input: UpdateVisaBookingQueryInput): Promise<IVisaBookingQuery>;
    deleteVisaBookingQuery(id: string): Promise<void>;
    getVisaBookingQueryStats(): Promise<{
        total: number;
        pending: number;
        contacted: number;
        closed: number;
    }>;
    getMyVisaBookingQueries(userId: string): Promise<IVisaBookingQuery[]>;
}
declare const _default: VisaBookingQueryService;
export default _default;
//# sourceMappingURL=visaBookingQuery.service.d.ts.map