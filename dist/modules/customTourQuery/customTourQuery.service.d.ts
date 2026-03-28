import { ICustomTourQuery } from "../../models/customTourQuery.model";
import { PaginationResult } from "../../utils/pagination";
interface CreateCustomTourQueryInput {
    name: string;
    email: string;
    phone: string;
    tourId?: string;
    tourTitle?: string;
}
interface UpdateCustomTourQueryInput {
    name?: string;
    email?: string;
    phone?: string;
    status?: "pending" | "contacted" | "closed";
}
interface GetCustomTourQueriesOptions {
    page?: number;
    limit?: number;
    search?: string;
    status?: "pending" | "contacted" | "closed";
    sortBy?: string;
    sortOrder?: "asc" | "desc";
}
declare class CustomTourQueryService {
    createCustomTourQuery(input: CreateCustomTourQueryInput): Promise<ICustomTourQuery>;
    getCustomTourQueries(options: GetCustomTourQueriesOptions): Promise<PaginationResult<ICustomTourQuery>>;
    getCustomTourQueryById(id: string): Promise<ICustomTourQuery>;
    updateCustomTourQuery(id: string, input: UpdateCustomTourQueryInput): Promise<ICustomTourQuery>;
    deleteCustomTourQuery(id: string): Promise<void>;
    getCustomTourQueryStats(): Promise<{
        total: number;
        pending: number;
        contacted: number;
        closed: number;
    }>;
}
declare const _default: CustomTourQueryService;
export default _default;
//# sourceMappingURL=customTourQuery.service.d.ts.map