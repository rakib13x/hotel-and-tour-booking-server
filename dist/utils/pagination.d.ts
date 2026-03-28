import { Document, Query } from "mongoose";
import { Request } from "express";
export interface PaginationOptions {
    page?: number;
    limit?: number;
    search?: string;
    sort?: string;
    fields?: string;
}
export interface PaginationResult<T> {
    data: T[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        pages: number;
        hasNext?: boolean;
        hasPrev?: boolean;
        next?: number;
        prev?: number;
    };
}
declare class APIFeatures<T extends Document> {
    query: Query<T[], T>;
    private queryString;
    constructor(query: Query<T[], T>, queryString: Record<string, any>);
    static extractPaginationOptions(req: Request): PaginationOptions;
    search(searchFields: string[]): this;
    filter(): this;
    sort(): this;
    limitFields(): this;
    pagination(): Promise<{
        currentPage: number;
        limit: number;
        totalPages: number;
        total: number;
    }>;
    static paginateWithPopulate<T = any>(model: {
        find: any;
        countDocuments: any;
    }, filter: any, options: PaginationOptions, populateField: string): Promise<PaginationResult<T>>;
}
export default APIFeatures;
//# sourceMappingURL=pagination.d.ts.map