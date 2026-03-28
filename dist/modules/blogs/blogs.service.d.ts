import { IBlog } from "./blogs.interface";
export declare const BlogService: {
    createBlogIntoDB: (payload: any) => Promise<IBlog>;
    getAllBlogsFromDB: (query: Record<string, any>) => Promise<{
        data: (import("mongoose").Document<unknown, {}, IBlog, {}, {}> & IBlog & {
            _id: import("mongoose").Types.ObjectId;
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
    getSingleBlogFromDB: (id: string) => Promise<IBlog | null>;
    updateBlogIntoDB: (id: string, payload: any) => Promise<IBlog | null>;
    deleteBlogFromDB: (id: string) => Promise<IBlog | null>;
    getBlogStatsFromDB: () => Promise<{
        total: number;
        published: number;
        draft: number;
    }>;
};
//# sourceMappingURL=blogs.service.d.ts.map